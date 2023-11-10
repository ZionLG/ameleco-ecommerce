import React from "react";
import { Clock5, MapPin, PhoneCall } from "lucide-react";

import { Branch } from "~/components/Branches";
import FeedbackForm from "~/components/FeedbackForm";
import HeaderCard from "~/components/HeaderCard";
import { Separator } from "~/components/ui/separator";
import ChangeBranch from "../components/ChangeBranch";

const ContactUs = () => {
  return (
    <main className="flex flex-col justify-center gap-10 px-10 py-5 ">
      {Branch.value === "Burnaby Branch" && (
        <iframe
          title="Burnaby Branch"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2603.8919388934555!2d-123.01293337688415!3d49.25949407239544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548676d80f0ae57f%3A0x9b4fdcbf4f3059e3!2zNDAxMiBNeXJ0bGUgU3QsIEJ1cm5hYnksIEJDIFY1QyA0RzIsINen16DXk9eU!5e0!3m2!1siw!2sil!4v1699563572149!5m2!1siw!2sil"
          width="fit"
          height="350"
          style={{ border: 0 }}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      )}
      {Branch.value === "Richmond Branch" && (
        <iframe
          title="Richmond Branch"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.4224248614655!2d-123.08452037688126!3d49.19254557713234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54867507f9e2f101%3A0xa3a36506b608f38!2zMTIzMzEgQnJpZGdlcG9ydCBSZCAzIDQsIFJpY2htb25kLCBCQyBWNlYgMUo0LCDXp9eg15PXlA!5e0!3m2!1siw!2sil!4v1699563647630!5m2!1siw!2sil"
          width="fit"
          height="350"
          style={{ border: 0 }}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      )}
      {Branch.value === "Port Coquitlam Branch" && (
        <iframe
          title="Port Coquitlam Branch"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.0921555914506!2d-122.76860687688409!3d49.25569917266406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485d6008f3e3a79%3A0x89fccdbbfb3fb0d1!2s1952%20Kingsway%20Ave%20Unit%20420%2C%20Port%20Coquitlam%2C%20BC%20V3C%206C2%2C%20%D7%A7%D7%A0%D7%93%D7%94!5e0!3m2!1siw!2sil!4v1699563682305!5m2!1siw!2sil"
          width="fit"
          height="350"
          style={{ border: 0 }}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-5 lg:flex-row">
          <span className="text-5xl font-bold">Contact Us - </span>
          <div className="flex flex-col items-center">
            <span>{Branch}</span>
            <ChangeBranch />
          </div>
        </div>
        <p>
          Hi, we are always open for cooperation and suggestions, contact us in
          one of the ways below.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-20 lg:flex-row">
        <div className="flex-grow">
          <div className="mb-6 text-3xl font-bold">Information</div>

          <div className="flex flex-col">
            <HeaderCard
              Icon={PhoneCall}
              titleText={"Call Us Today"}
              branchData={[
                {
                  branch: "Richmond Branch",
                  data: "(778) 295-2570",
                },
                {
                  branch: "Burnaby Branch",
                  data: "(604) 570-0867",
                },
                {
                  branch: "Port Coquitlam Branch",
                  data: "(778) 285-3999",
                },
              ]}
            />
            <HeaderCard
              Icon={Clock5}
              titleText={"When We're Open"}
              branchData={[
                {
                  branch: "Richmond Branch",
                  data: "7:00 am - 5:00 pm",
                },
                {
                  branch: "Burnaby Branch",
                  data: "7:00 am - 5:00 pm",
                },
                {
                  branch: "Port Coquitlam Branch",
                  data: "7:00 am - 5:00 pm",
                },
              ]}
            />
            <HeaderCard
              Icon={MapPin}
              titleText={"Where We At"}
              branchData={[
                {
                  branch: "Richmond Branch",
                  data: "Unit #3 - 4 12331 Bridgeport Road\nRichmond, BC. V6V 1J4",
                },
                {
                  branch: "Burnaby Branch",
                  data: "4012 Myrtle Street\nBurnaby, BC.  V5C 4G2",
                },
                {
                  branch: "Port Coquitlam Branch",
                  data: "Unit #420 1952 Kingsway Avenue\nPort Coquitlam, BC.  V3C 1S5",
                },
              ]}
            />
          </div>
        </div>
        <Separator orientation="vertical" className="h-auto" />

        <div className="flex-grow">
          <div className="mb-6 text-3xl font-bold">Feedback</div>
          <FeedbackForm />
        </div>
      </div>
    </main>
  );
};

export default ContactUs;
