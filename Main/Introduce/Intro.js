document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startNowBtn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      window.location.href = "../../Register/register.html";
    });
  }

  // Hiệu ứng xuất hiện khi cuộn
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // chỉ chạy 1 lần
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));
});
