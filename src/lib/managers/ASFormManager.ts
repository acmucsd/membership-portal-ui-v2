import { config } from '@/lib';
import { PrivateProfile, PublicEvent } from '@/lib/types/apiResponses';

const GRADUATION_YEAR_OPTIONS: Record<number, string> = {
  2027: 'Class of ‘27',
  2028: "Class of '28",
  2029: "Class of '29",
  2030: "Class of '30",
};

const generateASFormURL = (
  event: PublicEvent | undefined,
  user: PrivateProfile | undefined
): string => {
  const params = new URLSearchParams();

  if (event) {
    // Select the event you are signing in to:
    params.append(
      config.asForm.fields.eventName,
      `Association for Computing Machinery (ACM) - ${event.title}`
    );

    // Please list any and all food items received at this event, or N/A if you did not receive any
    // Fail safe: empty string if no food items, thus forcing user to fill it out
    if (event.foodItems) params.append(config.asForm.fields.foodItems, event.foodItems);
  }

  // How did you hear about this event?
  // TODO: Come up with a way to find out this info
  // params.append(config.asForm.fields.heardFrom, 'Forum Announcement (Discord, WeChat, etc.)');

  if (user) {
    // Email address checkbox
    params.append(config.asForm.fields.emailAddress, user.email);

    // What is your academic year?
    const graduationYear = GRADUATION_YEAR_OPTIONS[user.graduationYear];

    if (graduationYear) {
      params.append(config.asForm.fields.graduationYear, graduationYear);
    } else {
      const generatedGraduationYear = `Class of '${user.graduationYear.toString().slice(-2)}`;
      params.append(config.asForm.fields.graduationYear, '__other_option__');
      params.append(
        `${config.asForm.fields.graduationYear}.other_option_response`,
        generatedGraduationYear
      );
    }

    // What is your affiliation with the hosting organization(s)?
    // TODO: Get a list of board member emails so we can put Officer instead of Member, for now just tell board members to change it manually
    params.append(
      config.asForm.fields.memberAffiliation,
      user.onboardingSeen ? 'Member' : 'Attendee / Prospective Member'
    );
  }

  return `${config.asForm.baseUrl}?${params.toString()}`;
};

export default generateASFormURL;
