import { config } from '@/lib';
import { PrivateProfile, PublicEvent } from '@/lib/types/apiResponses';

export const generateASFormURL = (event: PublicEvent | undefined, user: PrivateProfile | undefined): string => {
    // fail safe: return base URL if no event or user
    if (!event || !user) return config.asForm.baseUrl;

    const params = new URLSearchParams();

    // Email
    params.append(config.asForm.fields.emailAddress, user.email);

    // Select the event you are signing in to:
    params.append(config.asForm.fields.eventName, 'Association for Computing Machinery (ACM) - ' + event.title);

    // What is your academic year?
    params.append(config.asForm.fields.graduationYear, 'Class of \'' + user.graduationYear.toString().slice(-2));

    // What is your affiliation with the hosting organization(s)?
    const affiliation = user.onboardingSeen ? 'Member' : 'Attendee / Prospective Member';
    params.append(config.asForm.fields.memberAffiliation, affiliation);

    // How did you hear about this event?
    params.append(config.asForm.fields.heardFrom, 'Forum Announcement (Discord, WeChat, etc.)');

    // Please list any and all food items received at this event, or N/A if you did not receive any
    params.append(config.asForm.fields.foodItems, event.foodItems || 'N/A');

    return `${config.asForm.baseUrl}?${params.toString()}`;
};