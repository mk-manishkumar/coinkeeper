import { LeftPanel } from "@/components/profileComponents/LeftPanel";
import { RightPanel } from "@/components/profileComponents/RightPanel";

export const Profile = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <LeftPanel />
      <RightPanel />
    </div>
  );
};

