# That Time React Yelled At Me For Using useEffect (And How useSyncExternalStore Saved My Shopping Cart)

Look, I'm just going to be straight with you. Last week I spent three hours debugging a hydration error that had me questioning my entire understanding of React. The kind of error that makes you wonder if you should've just become a carpenter instead.

But here's the thing - once I figured it out, it all made perfect sense. And I'm willing to bet you're dealing with the same issue right now. So let me save you those three hours.

## Here's What Happened

I was building a pretty standard e-commerce site. Nothing fancy - products, filters, and a shopping cart. You know, the usual stuff. I used Zustand for state management because it's cleaner than Redux, and I added the `persist` middleware so users wouldn't lose their cart when they refreshed the page. Smart, right?

Wrong. Well, not wrong exactly. But I was about to learn something new.

Everything looked perfect in development. The cart worked, items persisted, life was good. Then I deployed to production and opened the console, and there it was:

```
Hydration failed because the server rendered HTML didn't match the client.
```

Fantastic.

## The Code That Broke Everything

Here's what my header component looked like. Pretty simple stuff:

```tsx
"use client";

import { useCartStore } from "@/lib/stores/cartStores";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1">
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
      </Button>
    </header>
  );
}
```

Just a cart button with a little badge showing how many items you've added. Nothing crazy.

And here's my Zustand store:

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        // ... handles adding items
      },
      
      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage", // saves to localStorage
    },
  ),
);
```

Again, totally normal. So why was React having a meltdown?

## What Actually Went Wrong

Okay, so here's what was happening, and honestly once you understand it, it's kind of obvious. But when you're in the thick of it at 11 PM, nothing is obvious.

**On the server:**
- Next.js renders your component
- The Zustand store initializes with an empty cart (no localStorage on the server, obviously)
- `getTotalItems()` returns `0`
- The badge doesn't render because `totalItems > 0` is false
- Server sends HTML with just a button and cart icon

**On the client:**
- Browser receives that HTML
- React starts hydrating
- Zustand's `persist` middleware wakes up and goes "oh hey, let me check localStorage"
- Finds your saved cart with 3 items in it
- `getTotalItems()` now returns `3`
- React tries to render the badge
- React looks at the server HTML and goes "wait, where's this badge supposed to go? This doesn't match!"

And that's your hydration error. The server said "no badge" but the client said "definitely badge."

## My First "Fix" (Don't Do This)

Like any reasonable developer who just wants to go to bed, I Googled "prevent render until mounted React" and found the classic pattern:

```tsx
export function Header() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header>
      <Button variant="ghost" size="icon">
        <ShoppingCart className="w-5 h-5" />
        {mounted && totalItems > 0 && (
          <Badge>{totalItems}</Badge>
        )}
      </Button>
    </header>
  );
}
```

"Perfect!" I thought. "Now the badge won't render until we're on the client!"

And it worked! The hydration error was gone. I did a little victory dance. I was about to commit the code.

Then ESLint hit me with this:

```
Error: Calling setState synchronously within an effect can trigger cascading renders.
Effects are intended to synchronize state between React and external systems...
Calling setState synchronously within an effect body causes cascading renders 
that can hurt performance, and is not recommended.
```

Excuse me?

## Why React Wasn't Happy

Turns out, what I did was the equivalent of asking React to do extra work for no good reason. Here's what happens with that `mounted` pattern:

1. Component renders with `mounted: false`, badge hidden
2. Browser paints the screen
3. `useEffect` runs immediately
4. Sets `mounted: true`
5. This triggers another render immediately
6. Browser has to repaint

React is basically saying "Dude, why are you making me render twice? That's what effects are NOT for."

Effects are supposed to sync with external systems (like subscribing to WebSocket, or setting up event listeners), not to immediately trigger another render. It's like asking someone to go to the store, come back, then immediately go back to the same store. Inefficient.

And I get it now. This pattern technically works, but it's fighting against React instead of working with it.

## The Actual Solution (useSyncExternalStore)

So at this point I'm frustrated, tired, and seriously considering that carpentry career. But then I stumbled across `useSyncExternalStore` and everything clicked.

This hook was literally designed for exactly my situation. It was added in React 18 specifically to handle external stores (like Zustand, Redux, or even browser APIs) that might have different values on the server vs. the client.

Here's what the fixed code looks like:

```tsx
"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "@/lib/stores/cartStores";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const totalItems = useSyncExternalStore(
    useCartStore.subscribe,
    () => useCartStore.getState().getTotalItems(),
    () => 0
  );

  return (
    <header>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1">
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
      </Button>
    </header>
  );
}
```

That's it. No `useEffect`. No `mounted` state. No ESLint warnings. No hydration errors.

## Breaking It Down

`useSyncExternalStore` takes three arguments, and each one has a purpose:

### First argument: The subscribe function
```tsx
useCartStore.subscribe
```

This is how React subscribes to changes in your store. Zustand gives you this for free. When someone adds an item to the cart, this function makes sure React knows to re-render. You don't have to write this yourself - Zustand handles it.

### Second argument: Get the client value
```tsx
() => useCartStore.getState().getTotalItems()
```

This is what the value actually is on the client. After the page loads, after localStorage has been read, this is the real number of items in the cart. This is what users see.

### Third argument: Get the server value
```tsx
() => 0
```

This is the key to the whole thing. This tells React "when you're rendering on the server, the cart count is zero."

And that's exactly what the server rendered! No cart data, no localStorage, no items. Zero.

## Why This Works (The Magic Part)

Here's what blew my mind when I finally understood it:

**During server-side rendering:**
- React calls that third function: `() => 0`
- Gets `0` back
- Badge doesn't render (because `0 > 0` is false)
- Sends HTML with no badge
- Everything matches

**During hydration on the client:**
- React calls the second function: `() => useCartStore.getState().getTotalItems()`
- Zustand reads localStorage
- Gets `3` back
- React goes "oh, the server value was different from the client value"
- But here's the magic: **React expects this**
- We explicitly told React "server has 0, client might have something else"
- React handles the transition smoothly
- No hydration error!

The difference between this and my broken code is that with `useSyncExternalStore`, I'm not trying to hide the mismatch from React. I'm telling React upfront: "Hey, these values are going to be different, and that's okay."

React appreciates the honesty.

## When You'll Need This

After going through this whole ordeal, I started noticing situations where this pattern applies everywhere. You need `useSyncExternalStore` whenever you have data that's different on the server vs. the client.

**Shopping carts** (like mine)
- Server: empty cart
- Client: saved cart from localStorage

**User authentication**
```tsx
const isLoggedIn = useSyncExternalStore(
  useAuthStore.subscribe,
  () => useAuthStore.getState().isLoggedIn,
  () => false  // assume logged out on server
);
```

**Theme preferences**
```tsx
const theme = useSyncExternalStore(
  useThemeStore.subscribe,
  () => useThemeStore.getState().theme,
  () => 'light'  // default to light on server
);
```

**Window size** (for responsive stuff)
```tsx
const windowWidth = useSyncExternalStore(
  (callback) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  },
  () => window.innerWidth,
  () => 1024  // assume desktop on server
);
```

**Online/offline status**
```tsx
const isOnline = useSyncExternalStore(
  (callback) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  },
  () => navigator.onLine,
  () => true  // assume online on server
);
```

Basically, if it touches localStorage, sessionStorage, or any browser API that doesn't exist on the server, you probably need this hook.

## When You DON'T Need This

Don't go crazy and use this everywhere. You don't need it for:

**Regular React state**
```tsx
// Just use useState, seriously
const [count, setCount] = useState(0);
```

**Context values**
```tsx
// Context is fine as-is
const theme = useContext(ThemeContext);
```

**Props**
```tsx
// Props are just props
function Badge({ count }) {
  return <span>{count}</span>;
}
```

**Data that's the same on server and client**
If you're loading products via `getServerSideProps` and they're the same on both sides, you don't need this. The whole point is handling when they're different.

## The One Thing To Get Right

The most important part is picking the right server value (that third argument). It should match what the server actually renders.

```tsx
// ✅ Good - server has no cart data
const cartCount = useSyncExternalStore(
  subscribe,
  () => getCartCount(),
  () => 0
);

// ❌ Bad - server never renders 99
const cartCount = useSyncExternalStore(
  subscribe,
  () => getCartCount(),
  () => 99  // why would this be 99 on the server?
);
```

Think about it like this: What would this value be if the user had never visited your site before? That's your server value.

## A Quick Word About The Flash

You might notice the badge appears a split second after the page loads. That's normal. The server renders no badge, then the client adds it after hydration. It's fast enough that most users won't notice.

If it bothers you, you can:

**Reserve space for it:**
```tsx
<div className="w-5 h-5">
  {totalItems > 0 && <Badge>{totalItems}</Badge>}
</div>
```

**Use a skeleton:**
```tsx
{totalItems === undefined ? (
  <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full" />
) : totalItems > 0 ? (
  <Badge>{totalItems}</Badge>
) : null}
```

But honestly? I just left it. The flash is so quick that trying to fix it might make things worse.

## What I Learned

Here's what this whole experience taught me:

1. **Hydration errors aren't random** - They're React protecting you from bugs. When the server HTML doesn't match the client, something's actually wrong.

2. **The "mounted" pattern is a code smell** - If you're using `useEffect` to set state immediately, you're probably doing it wrong. There's usually a better way.

3. **React 18 has tools for this** - `useSyncExternalStore` exists specifically for external stores. Use it.

4. **Be explicit about mismatches** - Don't try to hide server/client differences from React. Tell React what's going on and let it handle it.

5. **ESLint warnings are your friend** - That cascading renders warning saved me from shipping bad code. Listen to the linter.

## The Pattern You'll Actually Use

Forget all the explanation. Here's what you'll copy-paste next time:

```tsx
import { useSyncExternalStore } from 'react';

const value = useSyncExternalStore(
  yourStore.subscribe,
  () => yourStore.getState().value,  // client value
  () => defaultValue                  // server value
);
```

That's it. Three lines. No effects, no mounting flags, no hydration errors.

## One Last Thing

If you're reading this because you're debugging a hydration error right now, I feel you. It's frustrating. But take a step back and think about what's different between server and client. Nine times out of ten, it's something in localStorage or a browser API.

And when you find it, just use `useSyncExternalStore`. Tell React what the server value is, what the client value is, and let React do its thing.

It took me three hours to figure this out. Hopefully, I just saved you two hours and fifty-five minutes.

Now go fix that hydration error.

---

*P.S. - If you're using Zustand with `persist`, literally just copy the cart example from this article. It'll work. Trust me.*
