import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png"
import "./Footer.css"

const Footer = () => {
  return (
    <div>
      <footer>
        <div className="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for mobile and IOS mobile phone</p>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="Appstore" />
        </div>
        <div className="midFooter">
            <h1>VINEET</h1>
            <p>High quality is our first priority</p>
            <p>Copyrights 2024 &copy; vineet_v22</p>
        </div>

        <div className="rightFooter">
            <h4>Follow us</h4>
            <a href="https://leetcode.com/">InstaGram</a>
            <a href="https://leetcode.com/">FaceBook</a>
            <a href="https://leetcode.com/">Twitter</a>
        </div>
      </footer>
    </div>
  )
}

export default Footer
