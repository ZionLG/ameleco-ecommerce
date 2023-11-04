import React from "react";
import Image from "next/image";

import { Branch } from "~/components/Branches";

const AboutUsSection = () => {
  return (
    <section className="flex flex-col items-center gap-10 p-5">
      <span className="text-7xl font-semibold text-primary">About Us</span>
      <div className="flex flex-col items-center gap-10 lg:flex-row">
        <div className="flex flex-col gap-5">
          <span className="text-4xl font-semibold text-primary">
            Who We Are
          </span>
          <p className="max-w-lg text-lg">
            Ameleco Electric Supply has electrical stores near Vancouver in
            Richmond, Port Coquitlam and Burnaby. Shop at your nearest Ameleco
            Electrical Store today! <br />
            <br />
            Ameleco is one of the largest electrical wholesale suppliers
            providing a wide range of products for residential electricians and
            commercial contractors in BC. We carry comprehensive product
            solutions for Lighting, Datacom, Wire & Cable, Power Management and
            Electrical Supplies. <br />
            <br />
            In addition to our online store, we have a variety of choice
            throughout Canada where our customers can find what they need for
            their specific electrical projects as well as product knowledge and
            expertise from our staff.
          </p>
        </div>
        <div>
          {Branch.value === "Richmond Branch" && (
            <Image
              priority
              src={"RichmondBranch.svg"}
              height={300}
              width={300}
              alt="Visit us 1952 KINGSWAY AVE UNIT 420, RICHMOND"
            />
          )}
          {Branch.value === "Port Coquitlam Branch" && (
            <Image
              priority
              src={"PortBranch.svg"}
              height={300}
              width={300}
              alt="Visit us 12331 BRIDGEPORT ROAD UNIT 3~4, PORT COQUITLAM"
            />
          )}
          {Branch.value === "Burnaby Branch" && (
            <Image
              priority
              src={"BurnabyBranch.svg"}
              height={300}
              width={300}
              alt="Visit us 4012 MYRTLE ST, BURNABY"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
