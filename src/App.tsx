
import { useEffect, useState } from 'react';
import './index.css';
import { info } from 'console';


interface TrackingDetail {
  kind: string;
  level: number
  manNamstring:string;
  manPic: string;
  telno: string;
  telno2: string;
  time: number;
  timeString: string;
  where: string;
  code: string|null;
  remark: string|null;
}


interface PackageData {
  adUrl: string;
  complete: boolean;
  invoiceNo: string;
  itemImage: string;
  itemName: string;
  level: number;
  receiverAddr: string;
  receiverName: string;
  recipient: string;
  result: string;
  senderName: string;
  trackingDetails: TrackingDetail[];
  orderNumber: string | null;
  estimate: string | null;
  productInfo: string | null;
  zipCode: string | null;
  lastDetail: TrackingDetail;
  lastStateDetail:TrackingDetail;
  firstDetail:TrackingDetail;
  completeYN: string;
}



interface Company {
  International : string;
  Code: string;
  Name : string;
}

interface ThemeColor {
  [key:string] :{
     back:  string;
    hover:  string;
    active : string;
    text:  string;
    outline: string;
    odd: string;
    after: string;
    border: string;
    rgb: string;
  }
}

interface ButtonType {
  name: string;
  theme: string;
  
}


function App() {

    // const [test, setTest] = useState<string>();
    const [carriers, setCarriers] = useState<Company[]>([]);
    // 모든 데이터 넣어준 데이터가 유지되고 필터된 거 따로 관리하기 위해 두개 만들어줌
    const [allCarriers, setAllCarriers] = useState<Company[]>([]);
    const [theme, setTheme] = useState<string>('default');
    
    // 택배 코드
    const [tCode, setTcode] = useState<string>('04');
    // 운송장 번호
    const [tinvoice, setTinvoice] = useState<string>('');
    const [tname, setTname] = useState<string>('CJ대한통운');
    const [isBtn, setIsBtn] = useState<number|null>(null);
    
    const [infoTracking, setInfoTracking] = useState<PackageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    

    
    const themeColor :ThemeColor = {
      "default":{
        "back" : "bg-gray-100",
        "hover" : "hover:bg-gray-700",
        "active" :"bg-gray-700",
        "text": "text-[#070606]",
        "outline" :"outline-gray-300",
        "odd": "odd:bg-gray-50",
        "after": "after:bg-gray-500",
        "border": "border-[#070606]",
        "rgb": "#F3F4F6"
      },
      "ivory":{
         "back" : "bg-[#FFF5E0]",
         "hover" : "hover:bg-[#D988B9]",
         "active" :"bg-[#D988B9]",
         "text": "text-[#0C356A]",
         "outline" :"outline-[#0C356A]",
         "odd": "odd:bg-[#FFF5E0]",
         "after": "after:bg-[#D988B9]",
         "border": "border-[#0C356A]",
         "rgb": "#FFF5E0"
      },
      "indigo":{
         "back" : "bg-indigo-500",
         "hover" : "hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
         "active" :"bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
         "text": "text-white",
         "outline" :"outline-indigo-300",
         "odd": "odd:bg-[#C9CDF9]",
         "after": "after:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
         "border": "border-[bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500]",
         "rgb": "#6767F5"
      },
      "yellow":{
         "back" : "bg-[#FACB00]",
         "hover" : "hover:bg-[#CB0000]",
         "active" :"bg-[#CB0000]",
         "text": "text-[#191919]",
         "outline" :"outline-[#F2F2F2]",
         "odd": "odd:bg-[#FACB00]",
         "after": "after:bg-[#CB0000]",
         "border": "border-[#F2F2F2]",
         "rgb": "#FACB00"
      }
    }
    
  const buttons :ButtonType[] =[
    {name: "default", theme: "default"},
    {name: "ivory", theme: "ivory"},
    {name: "indigo", theme: "indigo"},
    {name: "yellow", theme: "yellow"}
  ]

  

  useEffect(()=>{
    const fetchData = async ()=>{

      setIsLoading(isLoading)
      try{
        const res = await fetch(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`)
        const data = await res.json();
   
        setCarriers(data.Company);
        setAllCarriers(data.Company);
        setIsLoading(false)
     
      }catch(error){
        console.log(error);
      }
    }
    
    fetchData();
  },[])

 const selectCode = (BtnNumber: number, code:string, name :string)=>{
    setIsBtn(BtnNumber);
    setTcode(code);
    setTname(name)
    const isInternational = BtnNumber === 2 ? 'true' : 'false'
    const filterCar = allCarriers.filter(e => e.International === isInternational);
    setCarriers(filterCar)
 }


 const blindNumber = (e: React.ChangeEvent<HTMLInputElement>)=>{
  const value = e.target.value;
  if(isBtn ===1){
      e.target.value = e.target.value.replace(/[^0-9]/g,'')
    
  }
  setTinvoice(value)
 }

 const PostSubmit = async ()=>{
        setIsLoading(true)
        setIsShow(false); 
        setError('')


  
  //  const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tCode}&t_invoice= ${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`)

      // const url = new URL("http://info.sweettracker.co.kr/api/v1/trackingInfo");
      // url.searchParams.append("t_code", tCode);
      // url.searchParams.append("t_invoice", tinvoice);
      // url.searchParams.append("t_key", `${process.env.REACT_APP_API_KEY}`);
  
      try{
        const res = await fetch(`
        https://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tCode}&t_invoice= ${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}
        `)
        const data = await res.json()
        if(data.firstDetail ===null){
          setError('데이터가 없습니다')
          setIsLoading(false)
          return;
        }
        setIsLoading(false)
          
          if(data.code === '104' || data.code === '105'){
            setError(data.msg);
            
          }else{
            setInfoTracking(data);
            setIsShow(true);
             
          }
          
          console.log(data);

          
      }catch(error){
        console.log(error);
      }
 }

  const PostListName :string[] = ["상품인수","상품이동중", "배송지도착", "배송출발" ,"배송완료"];
  

  return (
    <>
    {
      isLoading &&
      <div className="fixed top-0 left-0 z-50 w-full h-full bg-black/50">
        <div className="absolute -translate-x-2 left-2/4 top-2/4 -translate-y-2/4">
        <svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <g transform="rotate(0 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(30 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(60 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(90 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(120 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(150 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(180 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(210 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(240 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(270 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(300 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(330 50 50)">
            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill={`${themeColor[theme].rgb}`}>
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
            </rect>
          </g>
          </svg>
        </div>
      </div>
      
    }
      <div className={`${themeColor[theme].back} flex justify-between p-5 text-sm text-black md:text-xl xl:-2xl`}>
        <h3 className='font-extrabold'>국내외 택배조회 시스템</h3>
        <div>
          <span>theme |</span>
          {
            buttons.map((e,i)=>{
              return(
                <button key={i} className="mx-1 md:mx-2 xl:mx-3"  onClick={() => setTheme(e.theme)}>
                    {e.name}
                </button>
              )
            })
          }
        </div>
      </div>

{/* content */}
      <div className='flex flex-wrap items-center justify-center px-2 py-2 text-sm border-t basis-full mx-auto mt-[200px] text-center'>
        
            
          <div className='flex flex-wrap md:flex-nowrap py-4 border-b basis-full h-[150px] md:h-[80px]'>
            <div className='justify-around basis-full md:basis-2/5 '>
                <span className='mr-5 text-center basis-1/5'>국내 / 국외 선택</span>
            
                  <button className={`text-sm border p-2 px-10 rounded-md hover:text-white mr-4 ${isBtn ===1 ? 'text-white' : 'text-black'} ${themeColor[theme].hover}  ${isBtn ===1 && themeColor[theme].active} backdrop-blur-md  shadow-md`} onClick={()=> selectCode(1,'04','CJ대한통운')}>국내</button>

                  <button className={`text-sm border bg-[rgba(255, 255, 255, 0.6)] p-2 px-10 rounded-md hover:text-white ${isBtn ===2 ? 'text-white' : 'text-black'}  ${themeColor[theme].hover}   ${isBtn ===2 && themeColor[theme].active}  ${isBtn ===2 && 'font-bold'} backdrop-blur-md shadow-md `} onClick={()=> selectCode(2,'12', 'EMS')}>국외</button>  
              </div>
                <select className='px-4 mx-auto border basis-4/5 md:basis-3/5' 
                  value={tCode} 
                  onChange={(e) => {
                    const result_code = e.target.value;
                    setTcode(result_code);
                    const result = carriers.find((carrier) => carrier.Code === result_code); 
                    if (result) {
                      setTname(result.Name);
                    }
                  }}>
                    {
                      carriers.map((e,i)=>{
                  
                        return(
                          <option key={i} className='w-[200px] text-black' value={e.Code} >
                              {e.Name}
                          </option>
                        )
                      })
                    }
                </select>
          </div>
          
              <div className="relative items-center py-4 text-center border-b basis-full">
                <input type="text" onInput={blindNumber} placeholder='운송장 번호를 입력해주세요' className={` w-[60%] border px-9 py-4 rounded-md ${themeColor[theme].outline}`} />
                <button className={`absolute top-5 right-[21%] ${themeColor[theme].back} shadow-md ${themeColor[theme].text} px-7 py-3 rounded-r-md  font-bold `} onClick={PostSubmit}>조회</button>
            </div>


          {error &&
            <div className="py-4 text-center border-b basis-full">
              <span className={`text-[#191919] font-bold`}>{error}</span>
            </div>

            }
          {
            isShow &&

            <>
              <div className="w-full">
                <div className={`${themeColor[theme].back} ${themeColor[theme].text} flex justify-center py-10 px-5 flex-wrap items-center text-center`}>
                  <span className='text-2xl basis-[45%] font-bold mr-5 mb-5'>운송장 번호</span>
                  <h3 className='text-xl basis-[45%] font-bold mb-5'>{tinvoice}</h3>
                  <span className='text-xl basis-[45%] font-bold mr-5 mb-5'>택배사</span>
                  <h3 className='text-2xl basis-[45%] font-bold mb-5'>{tname}</h3>
                </div>
                <div className="relative flex justify-around py-5 my-5 bg-white before:bg-[#e2e5e8] before:absolute before:h-[1px] before:box-border before:top-[45%] before:left-[10%] before:w-4/5 before:z-0">
                  {
                    Array(5).fill('').map((_,i)=>{
                      const resultLevel = infoTracking && i + 1 ===  (infoTracking?.level -1);
                      return(
                        <div key={i}>
                          {infoTracking && infoTracking?.complete}
                          <div className={`${resultLevel ? themeColor[theme].after : 'after:bg-gray-200'} relative z-10 after:absolute after:w-[60px] after:h-[60px] after:rounded-full after:top-0 after:left-0`}>
                            <img className='relative z-10' src={`images/ic_sky_delivery_step${i+1}_on.png`} alt={PostListName[i]} />
                            <p className='mt-1 text-xs text-center'>{PostListName[i]}</p>
                            {/* 레벨의 글자 > 테마의 색상 + 글자 진하게 */}
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                <div className="py-5 bg-white">
                  {
                    infoTracking && 
                    infoTracking.trackingDetails.slice().reverse().map((e,i)=>{
                      return(
                        <div className={`relative py-5 pl-20 group ${themeColor[theme].odd}`} key={i}>
                          <div className={`${ i === 0 ? `${themeColor[theme].active} ${themeColor[theme].border}` : 'bg-white'} relative w-2 h-2 rounded-full border-2 -left-[30px] top-10 z-30`}></div>
                          <p>{e.where} | {e.kind}</p>
                          <p>{e.telno}</p>
                          <p>{e.timeString}</p>
                          <div className={`absolute h-full group-last:h-0 w-0.5 left-[53px] top-[60px] z-20 ${themeColor[theme].active}`}></div>
                        </div>

                      )
                    })
                  
                  }
                </div>
              </div>
            </>
          }
      
           
      </div>


    </>
  );
}

export default App;
