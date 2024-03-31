import Typography from '@/components/common/Typography';
import LeftArrowIcon from '@/public/assets/icons/arrow-left.svg';
import RightArrowIcon from '@/public/assets/icons/arrow-right.svg';
import style from './style.module.scss';

interface PaginationControlsProps {
  page: number;
  onPage: (page: number) => void;
  pages: number;
}

function calculatePagesToDisplay(page: number, totalPages: number, maxWidth: number): number[] {
  const radius = (maxWidth - 1) / 2;
  if (page + radius >= totalPages) {
    return Array.from({ length: maxWidth }, (_, key) => totalPages - maxWidth + 1 + key);
  }
  const displayPage = page + 1;
  const start = Math.max(1, displayPage - radius);
  return Array.from({ length: Math.min(maxWidth, totalPages) }, (_, key) => start + key);
}

const PaginationControls = ({ page, onPage, pages }: PaginationControlsProps) => {
  const pagesToDisplay = calculatePagesToDisplay(page, pages, 5);

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
        {pagesToDisplay.map(displayPage => (
          <button
            type="button"
            onClick={() => onPage(displayPage - 1)}
            key={displayPage}
            className={style.pageButton}
          >
            <Typography
              variant="h5/regular"
              className={displayPage === page + 1 ? style.active : style.pageText}
            >
              {displayPage}
            </Typography>
          </button>
        ))}
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
