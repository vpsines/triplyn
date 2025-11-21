import {Header} from "../../../components";
import {ComboBoxComponent} from "@syncfusion/ej2-react-dropdowns";
import type { Route } from "./+types/create-trip";
import {comboBoxItems, selectItems} from "~/constants";
import {formatKey} from "~/lib/utils";
import {LayerDirective, LayersDirective, MapsComponent} from "@syncfusion/ej2-react-maps";
import {useState} from "react";
import {world_map} from "~/constants/world_map";

export const loader = async ()=>{
    const response = await fetch("https://restcountries.com/v3.1/independent?status=true");
    const data = await response.json();

    return data.map((country:any) => ({
        name: country.flag + country.name.common,
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap:country.maps?.openStreetMap,
    }));
}

const CreateTrip = ({loaderData}:Route.ComponentProps) => {

    const countries = loaderData as Country[];

    const [formData, setFormData] = useState<TripFormData>({
       country:countries[0]?.name || '',
       travelStyle:'',
       interest:'',
       budget:'',
       duration:0,
       groupType:''
    });

    const handleSubmit = async ()=>{

    }

    const handleChange = (key: keyof TripFormData,value: string|number) =>{
        setFormData({...formData, [key]: value});
    }

    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.name,
    }))

    const mapData = [
        {
            country: formData.country,
            color:'#EA382E',
            coordinates: countries.find(country => country.name === formData.country)?.coordinates || [],
        }
    ]

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header title={"Add a new Trip"} description={"View and edit AI generated travel plans"}/>
            <section className="mr-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    {/*Select country*/}
                    <div>
                        <label htmlFor="country">
                            Country
                        </label>
                        <ComboBoxComponent
                            id="country"
                            dataSource={countryData}
                            fields={{text:'text',value:'value'}}
                            placeholder="Select a Country"
                            className={"combo-box"}
                            change={(e:{value: string | undefined})=> {
                                if(e.value){
                                    handleChange('country',e.value);
                                }
                            }}
                            allowFiltering
                            filtering={(e)=>{
                                const query = e.text.toLowerCase();

                                e.updateData(
                                    countries.filter((country)=>
                                    country.name.toLowerCase().includes(query)).map(((country)=>({
                                        text: country.name,
                                        value:country.value
                                    })))
                                )
                            }}
                        />
                    </div>

                    {/*Input duration*/}
                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input
                            id={"duration"}
                            name="duration"
                            placeholder={"Enter a no of days"}
                            type="number"
                            className="form-input placeholder:text-gray-100"
                            onChange={(e)=>handleChange('duration',Number(e.target.value))}
                        />
                    </div>

                    {selectItems.map((key)=> (
                        <div>
                            <label htmlFor={key}>
                                {formatKey(key)}
                            </label>
                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item)=> (
                                    {
                                        text:item,
                                        value:item
                                    }
                                ))}
                                fields={{text:'text',value:'value'}}
                                placeholder={`Select ${formatKey(key)}`}
                                change={(e:{value: string | undefined})=> {
                                    if(e.value){
                                        handleChange(key,e.value);
                                    }
                                }}
                                allowFiltering
                                filtering={(e)=>{
                                    const query = e.text.toLowerCase();

                                    e.updateData(
                                        comboBoxItems[key].filter((item)=>
                                            item.toLowerCase().includes(query)).map(((item)=>({
                                            text: item,
                                            value:item
                                        })))
                                    )
                                }}
                                className="combo-box"
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor={"location"}>
                            Location on the world map
                        </label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    shapeData={world_map}
                                    dataSource={mapData}
                                    shapeDataPath="country"
                                    shapePropertyPath={"name"}
                                    shapeSettings={{
                                        colorValuePath:'color',
                                        fill:'#e5e5e5'
                                    }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>
                </form>
            </section>
        </main>
    )
}
export default CreateTrip
