import './SwitchCheckbox.scss'
function SwitchCheckbox(props) {
    return(
        <div className="checkbox_switch">
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id={props.id} />
                <label className="form-check-label" htmlFor={props.id}>
                    {props.label}</label>
            </div>
        </div>
    );
}

export default SwitchCheckbox;
