import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { BicepsFlexed } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">
        <div className="flex gap-2 font-bold text-lg">
          <span className="text-primary"><BicepsFlexed /></span> CoreBalance
        </div>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/dashboard">
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/registro">
                Registro
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/historial">
                Historial
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/fotos">
                Fotos
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="ml-4">
              <ModeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;