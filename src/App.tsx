
import { useEffect, useState } from 'react';
import './index.css';



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
    
    const [infoTracking, setInfoTracking] = useState<string>()


    
    const themeColor :ThemeColor = {
      "default":{
        "back" : "bg-gray-100",
        "hover" : "hover:bg-gray-700",
        "active" :"bg-gray-700",
        "text": "text-gray-700",
        "outline" :"outline-gray-300"
      },
      "skyblue":{
         "back" : "bg-[#00A9FF]",
         "hover" : "hover:bg-[#A0E9FF]",
         "active" :"bg-[#A0E9FF]",
         "text": "text-white",
         "outline" :"outline-[#00A9FF]"
      },
      "indigo":{
         "back" : "bg-indigo-500",
         "hover" : "hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
         "active" :"bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
         "text": "text-white",
         "outline" :"outline-indigo-300"
      },
      "pink":{
         "back" : "bg-[#FCAEAE]",
         "hover" : "hover:bg-[#FF6969]",
         "active" :"bg-[#FF6969]",
         "text": "text-white",
         "outline" :"outline-[#FF6969]"
      }
    }
    
  const buttons :ButtonType[] =[
    {name: "default", theme: "default"},
    {name: "skyblue", theme: "skyblue"},
    {name: "indigo", theme: "indigo"},
    {name: "pink", theme: "pink"}
  ]

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const res = await fetch(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`)
        const data = await res.json();
   
        setCarriers(data.Company);
        setAllCarriers(data.Company);
     
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
  const value = e.target.value
  e.target.value = e.target.value.replace(/[^0-9]/g,'')
  setTinvoice(value)
 }

 const PostSubmit = async ()=>{
  //  const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tCode}&t_invoice= ${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`)

      // const url = new URL("http://info.sweettracker.co.kr/api/v1/trackingInfo");
      // url.searchParams.append("t_code", tCode);
      // url.searchParams.append("t_invoice", tinvoice);
      // url.searchParams.append("t_key", `${process.env.REACT_APP_API_KEY}`);

      try{
          const res = await fetch(`
          http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tCode}&t_invoice= ${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}
          `)
          const data = res.json()
          console.log(data);
      }catch(error){
        console.log(error);
      }
 }


  return (
    <>
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
      <div className='flex flex-wrap items-center justify-center px-2 py-2 text-sm border-b border-t basis-full mx-auto mt-[200px] text-center'>
        
            
          <div className='flex flex-wrap py-4 border-b basis-full'>
            <div className='basis-2/5'>
            <span className='mr-5 text-center basis-1/5'>국내 / 국외 선택</span>
              <button className={`text-sm border p-2 px-10 rounded-md hover:text-white mr-4 ${isBtn ===1 ? 'text-white' : 'text-black'} ${themeColor[theme].hover}  ${isBtn ===1 && themeColor[theme].active} backdrop-blur-md  shadow-md`} onClick={()=> selectCode(1,'04','CJ대한통운')}>국내</button>

              <button className={`text-sm border bg-[rgba(255, 255, 255, 0.6)] p-2 px-10 rounded-md hover:text-white ${isBtn ===2 ? 'text-white' : 'text-black'}  ${themeColor[theme].hover}   ${isBtn ===2 && themeColor[theme].active}  ${isBtn ===2 && 'font-bold'} backdrop-blur-md shadow-md `} onClick={()=> selectCode(2,'12', 'EMS')}>국외</button>
              </div>
                <select className='border basis-3/5' value={tCode} onChange={(e)=>setTcode(e.target.value)}>
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
              <div className="py-4 text-center border-b basis-full">
                <input type="text" onInput={blindNumber} placeholder='운송장 번호를 입력해주세요' className={`w-[80%] border px-5 py-2 rounded-md ${themeColor[theme].outline}`} />
            </div>
            <div className={`py-4 text-center border-b basis-full ${themeColor[theme].back}`}>
              <button className={`bg-[rgba(255, 255, 255, 0.6)] shadow-md ${themeColor[theme].text} px-5 py-2 rounded-md  backdrop-blur-md font-bold `} onClick={PostSubmit}>조회</button>
            </div>

          
      
           
      </div>
    </>
  );
}

export default App;
