# Goal Description

The goal is to implement a proper Admin Login page, make the category filtering functional on the customer Menu page, and ensure the database is seeded with a comprehensive set of real products (with proper Unsplash images) spread across multiple categories for a complete look.

## Proposed Changes

### Frontend Component Updates

#### [NEW] `frontend/src/pages/auth/AdminLogin.jsx`
Create a dedicated Admin Login page with a distinct look (e.g., darker theme or specific branding) that uses the auth service to log in, but ensures only users with the `Admin` role can proceed to the dashboard.

#### [MODIFY] `frontend/src/App.jsx`
Update the `/admin/login` route to use the newly created `AdminLogin` component instead of the generic `Login` component.

#### [MODIFY] `frontend/src/pages/customer/Menu.jsx`
- Add a `selectedCategory` state variable.
- Update the category buttons to set the `selectedCategory`.
- Filter the displayed `products` array based on whether `selectedCategory` matches the product's `categoryId` (or 'All').
- Add dynamic styling to highlight the currently selected category button.

### Backend Data Seeding Updates

#### [MODIFY] `backend/seed.py`
- Enhance the seed script to include multiple categories such as "Veg Pizza", "Non-Veg Pizza", "Sides", and "Beverages".
- Add 6-8 distinct products with realistic, high-quality Unsplash image URLs that map to these categories.
- This will ensure the "category real work" and "image is real show as market" requirements are met nicely in the UI.

## Verification Plan

### Manual Verification
- Stop the current running backend process if needed and run `python seed.py` to refresh the database with the new extensive seed data.
- Navigate to the customer Menu page and verify that clicking different categories filters the products instantly.
- Verify that all products display high-quality real images.
- Navigate to `/admin/login` and verify the new admin-specific login UI and login flow.
