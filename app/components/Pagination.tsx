import { ReadonlyURLSearchParams } from "next/navigation"
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import Link from 'next/link'

type PaginationProps = {
  currentPage: number
  totalPages: number
  count: number
  searchParams: ReadonlyURLSearchParams
  pathname: string
  pageParamKey?: string
}

export default function Pagination(
  {currentPage, totalPages, count, searchParams, pathname, pageParamKey = 'page'} : PaginationProps
) {
  function buildPageHref( newPage: number ) {
    const params = new URLSearchParams(searchParams.toString())
    if (newPage <= 1) {
      params.delete(pageParamKey)
    } else {
      params.set(pageParamKey, String(newPage))
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  let paginationButtons: number[] = []
  let buttonCount = totalPages < 5 ? totalPages : 5

  if (currentPage < 3) {
    for (let i = 1; i <= buttonCount; i++) {
      paginationButtons.push(i)
    }
  } else if (totalPages >= 3 && currentPage > totalPages - 2) {
    for (let j = 1; j <= buttonCount; j++) {
      paginationButtons.push(totalPages + (j - buttonCount))
    }
  } else {
    for (let k = 1; k <= buttonCount; k++) {
      paginationButtons.push(currentPage + (k - 3))
      console.log('test')
    }
  }

  return (
    <div className="table__pagination">
      <div className="table__pagination__buttons">
        <Link title="First Page" href={buildPageHref(1)}><FiChevronsLeft /></Link>
        
        {currentPage > 1
          ? <Link title="Previous Page" href={buildPageHref(currentPage - 1)}><FiChevronLeft /></Link>
          : <div title="Previous Page" className="disabled"><FiChevronLeft /></div>
        }

        {paginationButtons.map(page => 
          <Link
            key={page}
            title={`Page ${page}`}
            className={currentPage === page ? 'active' : ''}
            href={buildPageHref(page)}>{page}
          </Link>
        )}

        {currentPage < totalPages
          ? <Link title="Next Page" href={buildPageHref(currentPage + 1)}><FiChevronRight /></Link>
          : <div className="disabled"><FiChevronRight /></div>
        }

        <Link title="Last Page" href={buildPageHref(totalPages)}><FiChevronsRight /></Link>
      </div>

      <div className='table__pagination__count'>
        <span>Page {currentPage} of {totalPages}</span>
        <span>({count ?? 0} total items)</span>
      </div>
    </div>
  )
}