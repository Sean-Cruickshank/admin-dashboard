import { ReadonlyURLSearchParams } from "next/navigation"
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import Link from 'next/link'

type PaginationProps = {
  currentPage: number
  totalPages: number
  searchParams: ReadonlyURLSearchParams
  pathname: string
  pageParamKey?: string
}

export default function Pagination(
  {currentPage, totalPages, searchParams, pathname, pageParamKey = 'page'} : PaginationProps
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
  } else if (currentPage > totalPages - 2) {
    for (let j = 1; j <= buttonCount; j++) {
      paginationButtons.push(totalPages + (j - 5))
    }
  } else {
    for (let k = 1; k <= buttonCount; k++) {
      paginationButtons.push(currentPage + (k - 3))
    }
  }

  return (
    <div className="table__pagination">
      <Link href={buildPageHref(1)}><FiChevronsLeft /></Link>
      
      {currentPage > 1
        ? <Link href={buildPageHref(currentPage - 1)}><FiChevronLeft /></Link>
        : <div className="disabled"><FiChevronLeft /></div>
      }

      {paginationButtons.map(page => 
        <Link
          key={page}
          className={currentPage === page ? 'active' : ''}
          href={buildPageHref(page)}>{page}
        </Link>
      )}

      {currentPage < totalPages
        ? <Link href={buildPageHref(currentPage + 1)}><FiChevronRight /></Link>
        : <div className="disabled"><FiChevronRight /></div>
      }

      <Link href={buildPageHref(totalPages)}><FiChevronsRight /></Link>
    </div>
  )
}