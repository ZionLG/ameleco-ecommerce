import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-secondary flex flex-col justify-around gap-20 px-10 py-20 md:px-20 ">
      <div className="flex flex-col flex-nowrap items-center justify-center gap-20 text-center md:flex-row md:flex-wrap md:items-start">
        <div className="flex flex-col items-start gap-2">
          <span className="text-3xl font-semibold ">Contact Us</span>
          <div className="flex flex-col items-start ">
            <span className="font-semibold">Richmond: (778) 296-2570</span>
            <span className="font-semibold">Burnaby: (604) 570-0867</span>
            <span className="font-semibold">
              Port Coquitlam: (778) 285-3999
            </span>
          </div>

          <span className="text-secondary-foreground text-left">
            1952 Kingsway Ave Unit 420,
            <br /> Port Coquitlam, BC V3C 6C2
          </span>
          <span className="text-secondary-foreground text-left">
            4012 Myrtle St, Burnaby,
            <br />
            BC V5C 4G2
          </span>
          <span className="text-secondary-foreground text-left">
            12331 Bridgeport Road Unit
            <br />
            3~4, Richmond, BC V6V 1J4
          </span>
          <span className="text-secondary-foreground">sales@ameleco.com</span>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="text-3xl font-semibold ">Ameleco Catalog</div>
          <Link
            href={"/shop"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            Lighting
          </Link>
          <Link
            href={"/shop"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            Wires
          </Link>
          <Link
            href={"/shop"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            Breaker
          </Link>
          <Link
            href={"/shop"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            Clearances
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="text-secondary-foreground text-3xl font-semibold">
            Customer Service
          </div>
          <Link
            href={"/user/settings"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            Help Centre
          </Link>
          <Link
            href={"/user/settings"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            My Account
          </Link>
          <Link
            href={"/user/settings"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            Track Order
          </Link>
          <Link
            href={"/faq#how-refund"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            Return Policy
          </Link>
          <Link
            href={"/faq"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            FAQ
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="text-3xl font-semibold ">Information</div>
          <Link
            href={"/about"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            About
          </Link>
          <Link
            href={"/contact"}
            className="text-secondary-foreground underline-offset-4 hover:underline"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="text-center font-semibold ">
        <div>© 2023 Ameleco Electric Supply, Inc. - All Rights Reserved</div>
        <div>Site by Metro Media</div>
      </div>
    </footer>
  );
};

export default Footer;
