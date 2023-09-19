const { Dropdown } = require("@nextui-org/react");
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import styled from "styled-components";

const Trigger = styled(Dropdown.Button)`
    margin: 0;
    border-radius: 5px;
    background: none;
    color: black;
    border: 1px solid ${({theme}) => theme.colors.darkPurple};
`

const FieldContiner = styled.div`
    margin-bottom: 20px;
`

const Error = styled.span`
    font-size: 10px;
    color: ${({theme}) => theme.colors.red};
`

export const StyledDropdown = ({options=[] ,placeholder = "Select", value, setValue, multiple=false, triggerClass = ""}) => {

    const selectedValue = useMemo(() => {
        let toShow = '';
        if(Array.isArray(value)){
            toShow = value.map(select => options.find(x => x.value === select)?.text);
            toShow = toShow.join(", ");
        } else {
            toShow = options.find(x => x.value === value)?.text;
        }
        return toShow;
    }, [value]);

    const onChange = (e) => {
        const selected = Array.from(e || []);
        setValue([0,1].includes(selected.length)? selected[0]: selected);
    }

    return (
        <Dropdown>
            <Trigger flat css={{ tt: "capitalize" }} className={triggerClass} >
                {selectedValue || placeholder}
            </Trigger>
            <Dropdown.Menu
                aria-label="Single selection actions"
                color="secondary"
                disallowEmptySelection
                selectionMode={multiple? "multiple" : "single"}
                selectedKeys={value}
                onSelectionChange={onChange}
            >
                {options.map(opt => <Dropdown.Item icon={opt.icon} key={opt.value} >{opt.text}</Dropdown.Item> )}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export const DropdownFormField = ({
    control, name, defaultValue, required, error, label, hint, placeholder, options, ...rest
}) => {
    return (
        <FieldContiner>
            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                render={({
                    field: { onChange, value = defaultValue || "", ref },
                    fieldState: { error },
                }) => (<>
                    {label && <h6 className="mb-1" >{label}</h6>}
                    <StyledDropdown
                        inputRef={ref}
                        margin={label ? 1 : 0}
                        placeholder={placeholder || label}
                        value={value}
                        setValue={onChange}
                        options={options}
                        status={error ? "error" : "default"}
                        {...rest}
                    />
                    { hint && <Error>{hint}</Error> }
                </>
                )}
            />
        </FieldContiner>
    )
}