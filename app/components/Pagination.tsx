import { ReadonlyURLSearchParams } from "next/navigation"
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
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

  // 1, currentPage - 2, totalPages - 4
  const nodeOne = 1

  // 2, currentPage - 1, totalPages - 3
  const nodeTwo = 2

  // 3, currentPage, totalPages - 2
  const nodeThree = 3

  // 4, currentPage + 1, totalPages - 1
  const nodeFour = 4

  // 5, currentPage + 2, totalPages
  const nodeFive = 5

  return (
    <div className="table__pagination">
      <Link href={buildPageHref(1)}>1</Link>

      {currentPage > 2
        ? <Link href={buildPageHref(currentPage - 2)}>{currentPage - 2}</Link>
        : <Link href={buildPageHref(1)}>1</Link>
      }

      {currentPage > 2
        ? <Link href={buildPageHref(currentPage - 1)}>{currentPage - 1}</Link>
        : <Link href={buildPageHref(2)}>2</Link>
      }


      {currentPage > 2 && currentPage < totalPages - 1
        ? <Link href={buildPageHref(currentPage - 1)}>{currentPage}</Link>
        : <Link href={buildPageHref(2)}>2</Link>
      }

      {currentPage < totalPages - 1
        ? <Link href={buildPageHref(currentPage + 1)}>{currentPage + 1}</Link>
        : <Link href={buildPageHref(totalPages - 1)}>{totalPages - 1}</Link>
      }

      {currentPage < totalPages - 1
        ? <Link href={buildPageHref(currentPage + 2)}>{currentPage + 2}</Link>
        : <Link href={buildPageHref(totalPages)}>{totalPages}</Link>
      }

      <Link href={buildPageHref(totalPages)}>{totalPages}</Link>
      </div>
  )
}