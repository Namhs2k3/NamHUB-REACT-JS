const MAX_VIEWED_PRODUCTS = 10; // Giới hạn số lượng sản phẩm đã xem

// Hàm để lưu sản phẩm đã xem
export const saveProductToLocalStorage = (productId) => {
  const viewedProducts = JSON.parse(localStorage.getItem("viewedProducts")) || [];

  // Kiểm tra nếu sản phẩm chưa được lưu trong danh sách
  if (!viewedProducts.includes(productId)) {
    // Thêm sản phẩm mới vào danh sách
    viewedProducts.push(productId);

    // Nếu danh sách đã có hơn 10 sản phẩm, xóa sản phẩm cũ nhất
    if (viewedProducts.length > MAX_VIEWED_PRODUCTS) {
      viewedProducts.shift(); // Xóa sản phẩm đầu tiên (cũ nhất)
    }
  }

  // Lưu danh sách sản phẩm vào localStorage
  localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
};

// Hàm để lấy danh sách sản phẩm đã xem
export const getViewedProducts = () => {
  return JSON.parse(localStorage.getItem("viewedProducts")) || [];
};

// Hàm để hiển thị sản phẩm đã xem
export const displayViewedProducts = () => {
  const viewedProducts = getViewedProducts();
  viewedProducts.forEach((productId) => {
    console.log(`Sản phẩm đã xem: ${productId}`);
    // Hiển thị sản phẩm từ API hoặc dữ liệu bạn có
  });
};
