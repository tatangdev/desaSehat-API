function clean(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
}

let data = {
    nama: 'tatang',
    kelas: null,
    umur: 17
}

clean(data);

console.log(data)