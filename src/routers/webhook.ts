interface SchemaField {
    required: boolean;
}

interface Schema {
    [key: string]: SchemaField;
}

interface DataRecord {
    [key: string]: string | undefined;
}

const scheme: Schema = {
    firstname: { required: true },
    lastname: { required: false },
    email: { required: true },
};

function validate(datas: DataRecord, schema: Schema): boolean {
    const inputvar: string[] = [];
    let isValid = true;

    for (const data in datas) {
        console.log(data);
    }

    for (const key in schema) {
        console.log(schema[key]);
        if (schema[key].required && (!datas[key] || datas[key]!.trim() === '')) {
            isValid = false;
            inputvar.push('false');
        }
    }

    console.log(inputvar);
    return isValid;
}

const datas: DataRecord = { firstname: 'oskar', lastname: 'oskar' };
validate(datas, scheme);

export { validate, scheme };