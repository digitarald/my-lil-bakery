-- Clear existing data
TRUNCATE public.order_items, public.orders, public.products RESTART IDENTITY CASCADE;

-- Insert sample products
INSERT INTO public.products (name, description, price, image, category, min_order_time, pre_order, in_stock) VALUES
('Rainbow Cupcakes', 'Colorful cupcakes with vanilla buttercream and rainbow sprinkles', 3.50, '/placeholder.svg?height=300&width=300', 'Cupcakes', 2, false, true),
('Chocolate Birthday Cake', 'Rich chocolate cake with chocolate ganache and decorative frosting', 45.00, '/placeholder.svg?height=300&width=300', 'Cakes', 24, true, true),
('Chocolate Chip Cookies', 'Classic chocolate chip cookies baked fresh daily', 2.25, '/placeholder.svg?height=300&width=300', 'Cookies', 1, false, true),
('Red Velvet Cupcakes', 'Moist red velvet cupcakes with cream cheese frosting', 4.00, '/placeholder.svg?height=300&width=300', 'Cupcakes', 2, false, true),
('Custom Wedding Cake', 'Elegant multi-tier wedding cake customized to your specifications', 200.00, '/placeholder.svg?height=300&width=300', 'Cakes', 72, true, true),
('Blueberry Muffins', 'Fresh blueberry muffins with a golden crumb topping', 3.25, '/placeholder.svg?height=300&width=300', 'Muffins', 2, false, true),
('Strawberry Shortcake', 'Light vanilla sponge with fresh strawberries and whipped cream', 35.00, '/placeholder.svg?height=300&width=300', 'Cakes', 12, true, true),
('Decorated Sugar Cookies', 'Hand-decorated sugar cookies perfect for any celebration', 2.75, '/placeholder.svg?height=300&width=300', 'Cookies', 4, false, true),
('Lemon Bars', 'Tangy lemon bars with powdered sugar and buttery shortbread crust', 3.75, '/placeholder.svg?height=300&width=300', 'Bars', 2, false, true),
('Cinnamon Rolls', 'Warm cinnamon rolls with cream cheese glaze', 4.50, '/placeholder.svg?height=300&width=300', 'Pastries', 1, false, true),
('Carrot Cake', 'Moist carrot cake with cream cheese frosting and chopped walnuts', 40.00, '/placeholder.svg?height=300&width=300', 'Cakes', 12, true, true),
('French Macarons', 'Delicate French macarons available in 6 different flavors', 2.50, '/placeholder.svg?height=300&width=300', 'Cookies', 6, false, true),
('Apple Pie', 'Traditional apple pie with flaky crust and cinnamon spice', 28.00, '/placeholder.svg?height=300&width=300', 'Pies', 8, true, true),
('Croissants', 'Buttery, flaky croissants baked fresh every morning', 3.00, '/placeholder.svg?height=300&width=300', 'Pastries', 1, false, true),
('Cheesecake', 'New York style cheesecake with graham cracker crust', 32.00, '/placeholder.svg?height=300&width=300', 'Cakes', 12, true, true);

-- Note: To create an admin user, first sign up through the application,
-- then run this query with the actual user ID:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
