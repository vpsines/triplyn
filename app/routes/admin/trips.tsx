import React from 'react'
import {Header} from "../../../components";

const Trips = () => {
    return (
        <main className="trip wrapper">
            <Header
                title="Trips"
                description ={"AI-generated travel plans"}
                ctaText="Create a Trip"
                ctaUrl={"/trips/create"}
            />
        </main>
    )
}
export default Trips
