import './FormButton.scss';

function FormButton({id, label, onClick}) {
    return (
        <button  onClick={onClick} id={id !=null ? id : '' } className="formButton" type="submit">{label}</button>
    );
}

export default FormButton;
