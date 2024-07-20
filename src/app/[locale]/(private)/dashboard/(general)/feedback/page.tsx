import CardWrapper from "@/components/common/CardWrapper";
import FeedbackForm from "@/components/private/dashboard/FeedbackForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
};

const ProfilePage = async () => {
  return (
    <CardWrapper
      headerLabel="Report an issue"
      description="What area are you having problems with?"
    >
      <FeedbackForm />
    </CardWrapper>
  );
};

export default ProfilePage;
