// Helper: get CSRF token (Django)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Delete profile
async function deleteProfile() {
    if (!confirm("Are you sure you want to delete your profile? This cannot be undone.")) return;

    try {
        const response = await fetch("/delete/", {
            method: "DELETE",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            }
        });

        if (response.ok) {
            alert("Profile deleted successfully!");
            window.location.href = "/signup/"; // redirect after deletion
        } else {
            const data = await response.json();
            alert("Error: " + (data.error || "Failed to delete profile"));
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while deleting profile.");
    }
}

// Event listener
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("delete-profile-btn");
    btn.addEventListener("click", deleteProfile);
});