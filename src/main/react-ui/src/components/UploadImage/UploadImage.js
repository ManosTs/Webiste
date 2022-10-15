import "./UploadImage.scss";
import Icon from "../../Icon";
import FormInput from "../Form/FormInput";
import {Fragment, useState} from "react";
import FormButton from "../Form/FormButton";
import {uploadImage} from "../../services/ImageService";
import Cookies from "js-cookie";
import default_profile from "../../resources/images/default_profile.png";
import Alert from "../Alert/Alert";
import LoaderSpinner from "../../main-ui/LoaderSpinner";

function UploadImage({close, imageKind}) {
    const [imgAttr, setImgAttr] = useState(imageKind === "profileImg" ? default_profile : "");

    const [responseStatus, setResponseStatus] = useState(null);

    const [loading, setLoading] = useState(false);

    const [imageProfileData, setImageProfileData] = useState({
        imageKind: "",
        userId: "",
        file: null
    });

    const [imageBackgroundData, setImageBackgroundData] = useState({
        imageKind: "",
        userId: "",
        file: null
    })

    const onFileChange = event => {
        if (event.target.files.length !== 0) {
            setImgAttr(URL.createObjectURL(event.target.files[0]));
            if (imageKind === "profileImg") {
                setImageProfileData({
                    imageKind: imageKind,
                    file: event.target.files[0],
                    userId: Cookies.get("id")
                });
            }

            if (imageKind === "backgroundImg") {
                setImageBackgroundData({
                    imageKind: imageKind,
                    file: event.target.files[0],
                    userId: Cookies.get("id")
                });
            }

        }

    };

    const handleFileUpload = (imageData) => {
        setLoading(true);
        let formData = new FormData();
        formData.append('file', imageData.file);
        formData.append('fileName', imageData.imageKind);
        formData.append('userId', imageData.userId);

        uploadImage(formData).then((response) => {
            if (response.status === 200) {
                setResponseStatus(200);
                setLoading(false);
            }
        });
    }

    const onFileUpload = () => {

        if (imageProfileData !== undefined || "" && imageKind === "profileImg") {
            handleFileUpload(imageProfileData);
        }

        if (imageBackgroundData !== undefined || "" && imageKind === "backgroundImg") {
            handleFileUpload(imageBackgroundData);
        }

    };
    return (
        <Fragment>

            <div className="uploadImage--container">
                {loading && <LoaderSpinner />}
                {responseStatus === 200 &&
                <Alert backgroundColor="blue" title="INFO"
                       text="Profile Picture uploaded successfully!"
                       buttonText="OK"
                       iconName="info"/>}
                <div className="uploadImage--container__wrapper">
                    <button onClick={close} className="uploadImage--container__closeButton">
                        <p>{imageKind === "profileImg" ? "Upload Profile Image" : "Upload Background Image"}</p>
                        <Icon name="close" size={35} color="#fff"/>
                    </button>
                    <div className="uploadImage--wrapper__body">
                        <div className="uploadImage--body__inputFile">
                            <FormInput name="imageProfile" id="imageProfile" type="file" handleChange={onFileChange}/>
                        </div>
                        <img style={imageKind === "profileImg" ? {width: "300px"} : {width: "100%", borderRadius: 0}}
                             src={imgAttr} alt="preview"/>
                        <FormButton id="imageUploadButton" label="Upload" onClick={onFileUpload}/>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}


export default UploadImage;
