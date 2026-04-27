import { useState } from "react";
import { 
  Trophy, 
  Users, 
  UserPlus, 
  Target, 
  Home,
  UtensilsCrossed,
  Heart,
  Zap,
  LogOut,
  User,
  Settings
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Players", url: "/players", icon: Users },
  { title: "Jungle Store", url: "/Jungle-Store", icon: UserPlus },
];

const gameItems = [
  { title: "Food Recommendations", url: "/food", icon: UtensilsCrossed },
  { title: "Health Suggestions", url: "/health", icon: Heart },
  { title: "Rivals Mode", url: "/rivals", icon: Zap },
];

const userItems = [
  { title: "Profile", url: "/profile", icon: User },
];

export function GameSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "neon-border-cyan bg-primary/10 text-primary font-medium" 
      : "hover:bg-muted/50 hover:text-primary transition-all duration-200";

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-60"} border-r-2 border-primary/20`} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-4 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <Trophy className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-pixel text-xs text-primary text-shadow-glow">PIXEL DASH</h1>
                <p className="text-xs text-muted-foreground font-retro">Gamification Hub</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-pixel text-xs text-primary/80">MAIN</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span className="font-retro text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Game Features */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-pixel text-xs text-accent/80">GAME</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gameItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span className="font-retro text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="font-pixel text-xs text-neon-pink/80">USER</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span className="font-retro text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 hover:bg-destructive/20 hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                  {!collapsed && <span className="font-retro text-sm">Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}