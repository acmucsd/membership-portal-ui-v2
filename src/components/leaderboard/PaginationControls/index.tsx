import LeftArrowIcon from '@/public/assets/icons/page-left-icon.svg';
import RightArrowIcon from '@/public/assets/icons/page-right-icon.svg';
import { useEffect, useState } from 'react';
import style from './style.module.scss';

interface PaginationControlsProps {
  page: number;
  // eslint-disable-next-line no-unused-vars
  onPage: (page: number) => void;
  pages: number;
}

const PaginationControls = ({ page, onPage, pages }: PaginationControlsProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(String(page + 1));
  }, [page]);

  return (
    <div className={style.paginationBtns}>
      <button
        type="button"
        className={style.paginationBtn}
        onClick={() => onPage(page - 1)}
        disabled={page <= 0}
      >
        <LeftArrowIcon />
      </button>
      <div className={style.paginationText}>
        <input
          className={style.pageNumber}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={e => {
            setValue(e.currentTarget.value);
            const page = +e.currentTarget.value - 1;
            if (Number.isInteger(page) && page >= 0 && page < pages) {
              onPage(page);
            }
          }}
        />
        <span>of</span>
        <span className={style.pageNumber}>{pages}</span>
      </div>
      <button
        type="button"
        className={style.paginationBtn}
        onClick={() => onPage(page + 1)}
        disabled={page >= pages - 1}
      >
        <RightArrowIcon />
      </button>
    </div>
  );
};

export default PaginationControls;
