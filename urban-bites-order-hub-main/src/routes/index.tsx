import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { ShoppingBag, Plus, Minus, Clock, Star, Search, X, Sparkles, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urban Bites — Order Fresh, Fast Food on WhatsApp" },
      { name: "description", content: "Browse the Urban Bites digital menu — burgers, pizzas, starters & mocktails. Order instantly via WhatsApp." },
      { property: "og:title", content: "Urban Bites — Digital Menu" },
      { property: "og:description", content: "Fast-casual favorites delivered. Order in one tap via WhatsApp." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=80" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type BadgeKind = "best" | "spicy" | "chef" | "new";
type Item = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: string;
  img: string;
  badge?: BadgeKind;
};

const WHATSAPP_NUMBER = "15551234567";

const CATEGORIES = [
  { key: "Featured", emoji: "✨" },
  { key: "Starters", emoji: "🍟" },
  { key: "Burgers", emoji: "🍔" },
  { key: "Pizzas", emoji: "🍕" },
  { key: "Mocktails", emoji: "🍹" },
] as const;

const ITEMS: Item[] = [
  { id: "b1", name: "Classic Smash Burger", desc: "Double beef patty, cheddar, house sauce", price: 450, category: "Burgers", badge: "best",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" },
  { id: "b2", name: "Spicy Chicken Burger", desc: "Crispy fillet, jalapeño slaw, chipotle mayo", price: 420, category: "Burgers", badge: "spicy",
    img: "https://images.unsplash.com/photo-1606131731446-5568d87113aa?auto=format&fit=crop&w=800&q=80" },
  { id: "b3", name: "Truffle Mushroom Burger", desc: "Swiss, sautéed mushrooms, truffle aioli", price: 520, category: "Burgers", badge: "chef",
    img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80" },

  { id: "p1", name: "Margherita Pizza", desc: "San Marzano tomato, fresh mozzarella, basil", price: 680, category: "Pizzas",
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80" },
  { id: "p2", name: "Pepperoni Storm", desc: "Loaded pepperoni, mozzarella, oregano", price: 820, category: "Pizzas", badge: "best",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80" },
  { id: "p3", name: "BBQ Chicken Pizza", desc: "BBQ glaze, smoked chicken, red onion", price: 850, category: "Pizzas", badge: "new",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" },

  { id: "s1", name: "Loaded Cheese Fries", desc: "Crispy fries, cheddar sauce, crispy onions", price: 320, category: "Starters", badge: "best",
    img: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80" },
  { id: "s2", name: "Buffalo Chicken Wings", desc: "Six pieces, buffalo glaze, ranch dip", price: 480, category: "Starters", badge: "spicy",
    img: "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=800&q=80" },
  { id: "s3", name: "Mozzarella Sticks", desc: "Golden fried, marinara dip", price: 380, category: "Starters",
    img: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=800&q=80" },

  { id: "m1", name: "Mint Lemonade", desc: "Fresh lime, mint, cane sugar, soda", price: 180, category: "Mocktails", badge: "best",
    img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80" },
  { id: "m2", name: "Berry Mojito", desc: "Mixed berries, mint, lime, sparkling water", price: 220, category: "Mocktails", badge: "new",
    img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80" },
  { id: "m3", name: "Passion Cooler", desc: "Passion fruit, orange, ginger fizz", price: 210, category: "Mocktails",
    img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80" },
];

const BADGE_STYLES: Record<BadgeKind, { label: string; className: string }> = {
  best: { label: "🔥 Best Seller", className: "bg-orange-100/95 text-orange-700 ring-1 ring-orange-200/80" },
  spicy: { label: "🌶️ Spicy", className: "bg-red-100/95 text-red-700 ring-1 ring-red-200/80" },
  chef: { label: "👨‍🍳 Chef's Choice", className: "bg-violet-100/95 text-violet-700 ring-1 ring-violet-200/80" },
  new: { label: "✨ New", className: "bg-emerald-100/95 text-emerald-700 ring-1 ring-emerald-200/80" },
};


function Index() {
  const [activeCat, setActiveCat] = useState<string>("Featured");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [pulseCart, setPulseCart] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const featured = useMemo(() => [ITEMS[0], ITEMS[4], ITEMS[7], ITEMS[10]], []);

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return ITEMS.filter((i) => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = { Featured: featured };
    for (const c of CATEGORIES) if (c.key !== "Featured") g[c.key] = ITEMS.filter((i) => i.category === c.key);
    return g;
  }, [featured]);

  const totals = useMemo(() => {
    let count = 0, sum = 0;
    for (const id in cart) {
      const q = cart[id];
      const item = ITEMS.find((i) => i.id === id);
      if (item) { count += q; sum += q * item.price; }
    }
    return { count, sum };
  }, [cart]);

  const triggerPulse = () => {
    setPulseCart(true);
    setTimeout(() => setPulseCart(false), 400);
  };

  const add = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    triggerPulse();
  };
  const remove = (id: string) => setCart((c) => {
    const q = (c[id] || 0) - 1;
    const next = { ...c };
    if (q <= 0) delete next[id]; else next[id] = q;
    return next;
  });

  const scrollToCat = (cat: string) => {
    setActiveCat(cat);
    setQuery("");
    const el = sectionRefs.current[cat];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (filtered) return; // pause when searching
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const cat = (visible.target as HTMLElement).dataset.cat;
          if (cat) setActiveCat(cat);
        }
      },
      { rootMargin: "-160px 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  const buildOrderText = (overrideCart?: Record<string, number>) => {
    const c = overrideCart || cart;
    const lines = Object.entries(c).map(([id, q]) => {
      const it = ITEMS.find((i) => i.id === id)!;
      return `${q}x ${it.name}`;
    });
    const sum = Object.entries(c).reduce((acc, [id, q]) => {
      const it = ITEMS.find((i) => i.id === id)!;
      return acc + it.price * q;
    }, 0);
    return `Hi Urban Bites, I want to order: ${lines.join(", ")}. Total: Rs. ${sum}.`;
  };

  const sendWhatsApp = (single?: Item) => {
    let text: string;
    if (single && totals.count === 0) {
      text = `Hi Urban Bites, I want to order: 1x ${single.name}. Total: Rs. ${single.price}.`;
    } else if (single && !cart[single.id]) {
      const next = { ...cart, [single.id]: 1 };
      setCart(next);
      text = buildOrderText(next);
    } else {
      text = buildOrderText();
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background pb-40">
      {/* Hero */}
      <header className="relative overflow-hidden mesh-bg">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_center,transparent_55%,oklch(0.985_0.006_75)_85%)]" />
        <div className="relative mx-auto max-w-3xl px-5 pt-8 pb-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.74_0.19_55)] to-[oklch(0.65_0.22_30)] text-white font-black shadow-[var(--shadow-glow)]">U</span>
              <div className="leading-tight">
                <div className="text-sm font-bold text-foreground">Urban Bites</div>
                <div className="text-[11px] font-medium text-muted-foreground inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.68_0.17_150)] animate-pulse" />
                  Open now
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-foreground/80">
              <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-[oklch(0.78_0.16_75)] text-[oklch(0.78_0.16_75)]" /> 4.8</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 25 min</span>
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#111827] sm:text-5xl">
            Craving something<br />
            <span className="bg-gradient-to-r from-[oklch(0.65_0.22_30)] via-[oklch(0.7_0.2_55)] to-[oklch(0.6_0.22_340)] bg-clip-text text-transparent">delicious?</span> <span className="inline-block animate-pop">✨</span>
          </h1>
          <p className="mt-3 max-w-md text-[15px] text-muted-foreground">
            Hand-crafted favorites, one tap away. Send your order straight to WhatsApp.
          </p>


          {/* Search */}
          <div className="mt-5 glass-card flex items-center gap-2 rounded-2xl px-4 py-3">
            <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search burgers, pizza, drinks…"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear" className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sticky category pills */}
      <nav className="sticky top-0 z-30">
        <div className="absolute inset-x-0 -top-3 h-6 bg-gradient-to-b from-transparent to-background/90" />
        <div className="relative border-b border-border/60 bg-background/75 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl">
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
              {CATEGORIES.map((cat) => {
                const active = !filtered && activeCat === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => scrollToCat(cat.key)}
                    className={[
                      "shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                      active
                        ? "bg-foreground text-background shadow-[0_8px_24px_-10px_oklch(0.18_0.02_260/0.6)] scale-105"
                        : "bg-card/70 text-foreground/75 ring-1 ring-border hover:bg-card hover:text-foreground",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none">{cat.emoji}</span>
                    {cat.key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Menu */}
      <main className="mx-auto max-w-3xl px-4 pt-6">
        {filtered ? (
          <section className="pt-2">
            <div className="mb-3 flex items-baseline justify-between px-1">
              <h2 className="text-xl font-extrabold tracking-tight">Search results</h2>
              <span className="text-xs font-medium text-muted-foreground">{filtered.length} found</span>
            </div>
            {filtered.length === 0 ? (
              <div className="glass-card rounded-3xl p-10 text-center">
                <div className="text-3xl">🥲</div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">Nothing matches "{query}". Try a different bite.</p>
              </div>
            ) : (
              <CardGrid items={filtered} cart={cart} onAdd={add} onRemove={remove} onOrder={sendWhatsApp} />
            )}
          </section>
        ) : (
          CATEGORIES.map((cat) => (
            <section
              key={cat.key}
              data-cat={cat.key}
              ref={(el: HTMLDivElement | null) => { sectionRefs.current[cat.key] = el; }}
              className="scroll-mt-32 pt-6"
            >
              <div className="mb-3 flex items-baseline justify-between px-1">
                <h2 className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight">
                  <span>{cat.emoji}</span> {cat.key}
                </h2>
                <span className="text-xs font-medium text-muted-foreground">
                  {grouped[cat.key].length} items
                </span>
              </div>
              <CardGrid items={grouped[cat.key]} cart={cart} onAdd={add} onRemove={remove} onOrder={sendWhatsApp} />
            </section>
          ))
        )}

        <footer className="mt-14 pb-8 text-center text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            © {new Date().getFullYear()} Urban Bites · Crafted fresh daily
          </div>
        </footer>
      </main>

      {/* Floating cart dock */}
      <FloatingCart
        count={totals.count}
        sum={totals.sum}
        cart={cart}
        open={cartOpen}
        pulse={pulseCart}
        onToggle={() => setCartOpen((o) => !o)}
        onClose={() => setCartOpen(false)}
        onAdd={add}
        onRemove={remove}
        onCheckout={() => sendWhatsApp()}
      />
    </div>
  );
}

function CardGrid({
  items, cart, onAdd, onRemove, onOrder,
}: {
  items: Item[];
  cart: Record<string, number>;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onOrder: (item: Item) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {items.map((item, i) => {
        const qty = cart[item.id] || 0;
        const badge = item.badge ? BADGE_STYLES[item.badge] : null;
        return (
          <article
            key={item.id}
            style={{ animationDelay: `${i * 40}ms` }}
            className="hover-lift animate-lift-in group relative flex flex-col overflow-hidden rounded-2xl premium-card"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={item.img}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              {badge && (
                <span className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight backdrop-blur-sm ${badge.className}`}>
                  {badge.label}
                </span>
              )}

              <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-extrabold text-foreground backdrop-blur-md">
                Rs. {item.price}
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col p-4">
              <h3 className="truncate text-base font-bold text-card-foreground">{item.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>

              <div className="mt-auto flex items-center gap-2 pt-3">
                {qty > 0 ? (
                  <div className="flex items-center gap-1 rounded-full bg-secondary p-0.5">
                    <button
                      aria-label="Remove one"
                      onClick={() => onRemove(item.id)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-card text-foreground shadow-sm transition active:scale-90"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-bold tabular-nums">{qty}</span>
                    <button
                      aria-label="Add one"
                      onClick={() => onAdd(item.id)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background shadow-sm transition active:scale-90"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAdd(item.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3.5 py-2 text-xs font-bold text-secondary-foreground transition hover:bg-foreground hover:text-background"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                )}
                <button
                  onClick={() => onOrder(item)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-3.5 py-2 text-xs font-bold text-whatsapp-foreground shadow-[0_8px_20px_-8px_oklch(0.68_0.17_150/0.6)] transition active:scale-95"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  Order
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function FloatingCart({
  count, sum, cart, open, pulse, onToggle, onClose, onAdd, onRemove, onCheckout,
}: {
  count: number; sum: number; cart: Record<string, number>;
  open: boolean; pulse: boolean;
  onToggle: () => void; onClose: () => void;
  onAdd: (id: string) => void; onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const visible = count > 0;
  const lines = Object.entries(cart).map(([id, q]) => ({ item: ITEMS.find((i) => i.id === id)!, q }));

  return (
    <>
      {/* Backdrop when expanded */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300",
          open && visible ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <div
        className={[
          "fixed inset-x-0 bottom-5 z-50 flex justify-center px-5 transition-all duration-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className={[
            "w-full max-w-md overflow-hidden bg-foreground text-background shadow-[0_24px_60px_-16px_rgba(17,24,39,0.45)] ring-1 ring-white/10 transition-all duration-500",
            open ? "rounded-[32px]" : "rounded-full",
            pulse ? "scale-[1.03]" : "scale-100",
          ].join(" ")}
        >

          {/* Expanded list */}
          <div
            className={[
              "grid transition-[grid-template-rows] duration-500 ease-out",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            ].join(" ")}
          >
            <div className="overflow-hidden">
              <div className="max-h-72 overflow-y-auto px-4 pt-4 pb-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold">Your order</h3>
                  <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <ul className="space-y-2">
                  {lines.map(({ item, q }) => (
                    <li key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/5 p-2 pr-3">
                      <img src={item.img} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{item.name}</div>
                        <div className="text-[11px] text-background/60">Rs. {item.price}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 p-0.5">
                        <button onClick={() => onRemove(item.id)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-white/15" aria-label="Remove one">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-5 text-center text-xs font-bold tabular-nums">{q}</span>
                        <button onClick={() => onAdd(item.id)} className="grid h-6 w-6 place-items-center rounded-full bg-white/20 hover:bg-white/30" aria-label="Add one">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="my-3 h-px bg-white/10" />
                <div className="flex items-center justify-between pb-2 text-sm">
                  <span className="text-background/70">Subtotal</span>
                  <span className="font-extrabold">Rs. {sum}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dock bar */}
          <div className="flex items-center gap-2 p-2">
            <button
              onClick={onToggle}
              className="flex flex-1 items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-white/5"
            >
              <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                <ShoppingBag className="h-4.5 w-4.5" />
                <span
                  key={count}
                  className="animate-pop absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-primary-foreground ring-2 ring-foreground"
                >
                  {count}
                </span>
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-medium text-background/65">
                  {open ? "Hide cart" : "View cart"}
                </span>
                <span className="block text-sm font-extrabold">Rs. {sum}</span>
              </span>
              <ChevronUp className={`ml-1 h-4 w-4 text-background/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={onCheckout}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-whatsapp px-4 py-3 text-sm font-extrabold text-whatsapp-foreground shadow-[0_10px_30px_-8px_oklch(0.68_0.17_150/0.7)] transition active:scale-95"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2.5c-5.27 0-9.54 4.27-9.54 9.54 0 1.68.44 3.32 1.28 4.76L2.5 21.5l4.83-1.27a9.5 9.5 0 0 0 4.7 1.21h.01c5.26 0 9.54-4.27 9.54-9.54s-4.27-9.4-9.54-9.4Zm5.6 13.66c-.24.66-1.4 1.26-1.92 1.32-.49.07-1.11.1-1.79-.11-.41-.13-.94-.31-1.62-.6-2.86-1.24-4.72-4.13-4.86-4.32-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.29.56-.36.75-.36h.54c.17 0 .4-.06.63.48.24.55.81 1.93.88 2.07.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.31.38-.44.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.6 1.98 1.1.98 2.03 1.28 2.32 1.43.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.65.78 1.93.92.29.14.48.21.55.33.07.12.07.7-.17 1.36Z"/>
    </svg>
  );
}
