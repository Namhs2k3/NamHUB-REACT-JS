export const calculateLocalStorageSize = ()=> {
    let total = 0;
    for (let key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            const value = localStorage.getItem(key);
            total += key.length + value.length;
        }
    }
    console.log(`Local Storage đang sử dụng khoảng ${total / 1024} KB`);
    return total / 1024; // Trả về kích thước tính bằng KB
}
