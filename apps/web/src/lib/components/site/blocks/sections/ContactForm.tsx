import { ContactFormBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { Map } from "../../Map";
import { Calendar1, CalendarPlus, Mail, Phone } from "lucide-react";
import { Button } from "@/lib/ui/shadcn/button";
import { LogoSmall } from "@/lib/components/Logos";
import Link from "next/link";

export const ContactFormSection: React.FC<ContactFormBlock> = (p) => {
  return (
    <Section section={p.section}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3 max-w-screen-2xl mx-auto">
        <div className="xl:col-span-2 h-[650px] rounded-2xl border overflow-clip">
          <Map
            postiton={{ lat: 39.742043, lng: -104.991531 }}
            marker={{ lat: 39.742043, lng: -104.991531 }}
            zoom={9}
          />
        </div>
        <div className="flex flex-col gap-5 justify-between w-full bg-white rounded-2xl p-15 px-5 sm:px-12">
          <div className="flex flex-col gap-5">
            <LogoSmall className="w-10 fill-foreground" />
            <h2 className="text-2xl lg:text-3xl font-bold">Get In Touch</h2>
            <div className="flex items-center gap-2 text-xl lg:text-xl">
              <Phone />
              <p>(720)427-3702</p>
            </div>

            <div className="flex items-center gap-2 text-xl lg:text-xl">
              <Mail />
              <p>info@prepbun.com</p>
            </div>

            <div className="flex items-center gap-3 text-xl lg:text-xl">
              <Calendar1></Calendar1>
              <p>Monday - Friday / 9:00am - 6:00pm</p>
            </div>

            <Link href="https://meetings-na2.hubspot.com/thao-bui">
              <Button size="lg" className="w-fit">
                <CalendarPlus></CalendarPlus>
                Schedule Free Session
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl lg:text-3xl font-bold">Need Help Now?</h2>
            <p className="text-xl">
              Need support? We reply to our chat the fastest. Get connected with
              somebody now.
            </p>
            <Button size="lg" className="w-fit">
              Chat Now
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};
