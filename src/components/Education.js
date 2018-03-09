import React from 'react'


const Education = () =>{
    return (
    <section className="sub form">
        <h2>
                Formation initiale
        </h2>
            <div className="school">
                <span className="left">2008</span>
                <span className="right">EPITECH</span>
             </div>
             <div className="diplome">
                {"Master Expert en Technologies de l'Information"}<br/>
                <i className="grey">Paris, France</i>
             </div>
             <div className="school">
                <span className="left">2006</span><span className="right">EPITECH</span>
             </div>
             <div className="diplome">
                {"Bachelor en Technologies de l'Information"}<br/>
                <i className="grey">Paris, France</i>
             </div>
    </section>
    );
};

export default Education;
