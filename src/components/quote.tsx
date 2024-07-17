// Import necessary components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

// Define the Quote component
const Quote: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-8 text-center p-8 rounded-lg font-inter">
      <p className="text-3xl font-normal text-[#1a1a1a]">
        omg, this is spot on!
        <br />
        how does twitter know
        <br />
        me so well?!
      </p>
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://pbs.twimg.com/profile_images/1720918552721661952/Opqp--Su_400x400.jpg" />
          <AvatarFallback>FK</AvatarFallback>
        </Avatar>
        <div className="text-lg font-medium text-[#1a1a1a] pt-3">
          Filip Kozera{" "}
          <span className="text-gray-500">
            <Link href="https://x.com/kozerafilip" passHref>
              (@kozerafilip)
            </Link>
          </span>
        </div>
        <div className="text-md text-gray-500">CEO & Co-founder, Wordware</div>
      </div>
    </div>
  );
};

// Export the Quote component as default
export default Quote;
