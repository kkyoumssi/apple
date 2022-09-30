import React from "react";
import DaumPostcode from "react-daum-postcode";
import axios from 'axios';

function App(props) {

    const handleComplete = async (v) => {

        await axios.post('https://test-api.gftms.com/api/td/chkZipcode', JSON.stringify([v.zonecode]), {
            headers:
                {
                    "Content-Type": `application/json`
                    , 'TMS-APP-CODE': 'HOMEPICK'
                    , 'TMS-APP-KEY': '38e0bc42-e060-11eb-ba80-0242ac130004'
                }
        }).then((res) => {
            if (res.data.success) {
                for (let [key, value] of Object.entries(res.data.data)) {
                    let msg = '우편번호(' + key + ')는 ' + (value ? '배송 가능 지역입니다.' : '배송 불가능 지역입니다.')
                    alert(msg);

                }
            }

            window.location.replace("/");

        }).catch((error) => {
            console.log(error)
        })

    };

    const handleSearch = () => {

    };

    return (
        <DaumPostcode
            onComplete={handleComplete}
            onSearch={handleSearch}
            {...props}
        />
    );
}

App.defaultProps = {
    style: {
        width: "700px",
        height: "450px",
    },
};

export default App;