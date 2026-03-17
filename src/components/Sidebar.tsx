"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Panel", icon: "🏠" },
  { href: "/mapa", label: "Mi Mapa", icon: "🗺️", sub: "identidad" },
  { type: "divider", label: "Contenido" },
  { href: "/ideas", label: "Ideas", icon: "💡" },
  { href: "/maestro", label: "Maestro", icon: "🎯" },
  { href: "/piezas", label: "Piezas", icon: "📝" },
  { href: "/planificador", label: "Planificador", icon: "📅" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-senda-jet text-white h-14 flex items-center px-4">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="mr-3 text-xl">
          ☰
        </button>
        <span className="font-heading font-semibold text-lg">Senda Impulsa</span>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-senda-jet text-white z-50 transition-all duration-300 flex flex-col
          ${collapsed ? "w-16" : "w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          {!collapsed && (
            <Link href="/dashboard" className="font-heading font-semibold text-lg tracking-tight">
              Senda Impulsa
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-white/60 hover:text-white hidden lg:block"
          >
            {collapsed ? "→" : "←"}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-white/60 hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item, i) => {
            if (item.type === "divider") {
              return !collapsed ? (
                <div key={i} className="px-4 pt-6 pb-2 text-xs uppercase tracking-wider text-white/40 font-medium">
                  {item.label}
                </div>
              ) : (
                <div key={i} className="my-2 mx-3 border-t border-white/10" />
              );
            }
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all
                  ${active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && (
                  <div>
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.sub && (
                      <span className="block text-[10px] text-white/40 mt-0.5">{item.sub}</span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {!collapsed && (
            <div className="text-xs text-white/40 font-mono-senda">
              Trabajar mejor para vivir mejor
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
