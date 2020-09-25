const form = document.getElementById("main-form");

const testFun = async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost:8081/test")
  try {
    const data = await res.json();
    alert(data.test);
  }catch(error) {
    console.log("error", error);
  }
}

form.addEventListener('submit',testFun)

export { testFun }
