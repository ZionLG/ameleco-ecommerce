import React from "react";
import { ShoppingCart } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const HeaderCart = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger className="justify-self-end outline-none ">
        <ShoppingCart strokeWidth={1} size={36} opacity={isOpen ? 0.5 : 1} />
      </DropdownMenuTrigger>

      <DropdownMenuContent></DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderCart;
