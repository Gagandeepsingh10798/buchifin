import Loader from "react-loader-spinner";
import "./style.scss"

function Home_Loader({visible=false, children}) {


    return (
      <>
      
      <div className={`${visible?"loader":""}`}>
        <Loader
          className="loader_class"
          type="Bars"
          color="#13651B"
          height={70}
          width={70}
          secondaryColor="grey"
          visible={visible}
        />
      </div>
        {children}
      </>
    );
  
}

export default Home_Loader;