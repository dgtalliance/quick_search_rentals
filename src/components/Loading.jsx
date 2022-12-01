export default function Loading(params) {
  return (
    <div
      className='ip-loader-wrapper js-loader ip-position-fixed ip-inset-0 ip-d-flex ip-align-items-center ip-justify-content-center ip-w-full ip-h-full'
      data-animation-name=''
      data-animation-duration='2000ms'
      style={
        {
            '--ip-loader-background-color': '#fff', 
            '--ip-loader-color': '#000',
            '--ip-title-color': '#000'
        }
        }>
      <div className='ip-loader ip-loader-cube ip-d-inline-block ip-position-relative'>
        <div></div>
      </div>
    </div>
  )
}
