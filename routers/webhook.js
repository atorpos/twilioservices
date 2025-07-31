
scheme = {
    firstname: {
        required: true,
    },
    lastname: {
        required: false,
    },
    email: {
        required: true,
    }
}

function validate(datas, schema) {
    const inputvar = [];
    let isValud = true;
    for (const data in datas) {
        console.log(data);
    }

    for (const key in schema) {
        console.log(schema[key]);
        if(schema[key].required && (!datas[key] || datas[key].trim() === '')) {
            isValud = false;
            inputvar.push(`false`);
        }
    }

    console.log(inputvar);

}

datas = {firstname: 'oskar', lastname: 'oskar'};


 validate(datas, scheme);