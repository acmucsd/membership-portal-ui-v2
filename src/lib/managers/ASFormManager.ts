import { config } from '@/lib';
import { PrivateProfile, PublicEvent } from '@/lib/types/apiResponses';

export const generateASFormURL = (event: PublicEvent | undefined, user: PrivateProfile | undefined): string => {
    // fail safe: return base URL if no event or user

    const params = new URLSearchParams();

    if(event) {
        // Select the event you are signing in to:
        params.append(config.asForm.fields.eventName, 'Association for Computing Machinery (ACM) - ' + event.title);

        // Please list any and all food items received at this event, or N/A if you did not receive any
        // Fail safe: empty string if no food items, thus forcing user to fill it out
        params.append(config.asForm.fields.foodItems, event.foodItems || '');
    }

    // How did you hear about this event?
    // TODO: Come up with a way to find out this info
    // params.append(config.asForm.fields.heardFrom, 'Forum Announcement (Discord, WeChat, etc.)');

    if(user) {
        // Email address checkbox
        params.append(config.asForm.fields.emailAddress, user.email);

        // What is your academic year?
        params.append(config.asForm.fields.graduationYear, 'Class of \'' + user.graduationYear.toString().slice(-2));

        // What is your affiliation with the hosting organization(s)?
        // TODO: Get a list of board member emails so we can put Officer instead of Member, for now just tell board members to change it manually
        const affiliation = user.onboardingSeen ? 'Member' : 'Attendee / Prospective Member';
        params.append(config.asForm.fields.memberAffiliation, affiliation);
    }


    return `${config.asForm.baseUrl}?${params.toString()}`;
};