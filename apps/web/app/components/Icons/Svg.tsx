const Svg = ({
  width,
  height,
  viewBox,
  'aria-label': ariaLabel,
  children,
} : {
    width: number,
    height: number,
    viewBox: string,
    'aria-label'?: string,
    children: React.ReactNode,
}) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={ viewBox }
    width={ width }
    height={ height }
    aria-hidden={ ariaLabel ? true : undefined }
    aria-label={ ariaLabel }
  >{ children }</svg>

  export default Svg