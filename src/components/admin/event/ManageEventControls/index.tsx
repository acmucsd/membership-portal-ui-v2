import { config, showToast } from '@/lib';
import { AdminEventManager } from '@/lib/managers';
import { PublicEvent } from '@/lib/types/apiResponses';
import { IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AiFillEdit, AiFillEye, AiOutlineLink } from 'react-icons/ai';
import { BsDiscord } from 'react-icons/bs';
import { IoCopy } from 'react-icons/io5';
import style from './style.module.scss';

interface IProps {
  event: PublicEvent;
}

const ManageEventControls = ({ event }: IProps) => {
  const router = useRouter();

  const duplicateEvent = () => {
    router.push(`${config.admin.events.createRoute}?duplicate=${event.uuid}`);
  };

  const generateDiscordEvent = () => {
    AdminEventManager.createDiscordEvent({
      ...event,
      onSuccessCallback: () => {
        showToast('Successfully created event!', 'Check your server to confirm all details');
      },
      onFailCallback: e => {
        showToast('error', e);
      },
    });
  };

  const generateACMURL = () => {
    showToast('Function not implemented yet!');
  };

  const controls = [
    {
      tooltip: 'View Public Event Page',
      icon: <AiFillEye className={style.theme} />,
      action: () => router.push(`https://acmucsd.com/events/${event.uuid}`),
    },
    {
      tooltip: 'Edit Details',
      icon: <AiFillEdit className={style.theme} />,
      action: () => router.push(`${config.admin.events.editRoute}/${event.uuid}`),
    },
    {
      tooltip: 'Duplicate Event',
      icon: <IoCopy className={style.theme} />,
      action: duplicateEvent,
    },
    {
      tooltip: 'Generate Discord Event',
      icon: <BsDiscord className={style.theme} />,
      action: generateDiscordEvent,
    },
    {
      tooltip: 'Generate ACMURL',
      icon: <AiOutlineLink className={style.theme} />,
      action: generateACMURL,
    },
  ];

  return (
    <div className={style.eventControls}>
      {controls.map(control => (
        <Tooltip key={control.tooltip} title={control.tooltip}>
          <IconButton onClick={control.action}>{control.icon}</IconButton>
        </Tooltip>
      ))}
    </div>
  );
};

export default ManageEventControls;
