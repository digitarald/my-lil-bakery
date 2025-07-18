-- Insert sample products
INSERT INTO public.products (name, description, price, image, category, min_order_time, pre_order, in_stock) VALUES
('Chocolate Cupcakes', 'Rich chocolate cupcakes with vanilla buttercream frosting', 3.50, '/placeholder.svg?height=300&width=300', 'Cupcakes', 2, false, true),
('Vanilla Birthday Cake', 'Classic vanilla cake with rainbow sprinkles and buttercream', 45.00, '/placeholder.svg?height=300&width=300', 'Cakes', 24, true, true),
('Chocolate Chip Cookies', 'Warm, gooey chocolate chip cookies baked fresh daily', 2.25, '/placeholder.svg?height=300&width=300', 'Cookies', 1, false, true),
('Red Velvet Cupcakes', 'Moist red velvet cupcakes with cream cheese frosting', 4.00, '/placeholder.svg?height=300&width=300', 'Cupcakes', 2, false, true),
('Custom Wedding Cake', 'Beautiful multi-tier wedding cake customized to your preferences', 150.00, '/placeholder.svg?height=300&width=300', 'Cakes', 72, true, true),
('Blueberry Muffins', 'Fresh blueberry muffins with a golden crumb topping', 3.25, '/placeholder.svg?height=300&width=300', 'Muffins', 2, false, true),
('Strawberry Shortcake', 'Light sponge cake with fresh strawberries and whipped cream', 35.00, '/placeholder.svg?height=300&width=300', 'Cakes', 12, true, true),
('Sugar Cookies', 'Decorated sugar cookies perfect for any occasion', 2.75, '/placeholder.svg?height=300&width=300', 'Cookies', 4, false, true),
('Lemon Bars', 'Tangy lemon bars with a buttery shortbread crust', 3.75, '/placeholder.svg?height=300&width=300', 'Bars', 2, false, true),
('Cinnamon Rolls', 'Warm cinnamon rolls with cream cheese glaze', 4.50, '/placeholder.svg?height=300&width=300', 'Pastries', 1, false, true),
('Carrot Cake', 'Moist carrot cake with cream cheese frosting and walnuts', 40.00, '/placeholder.svg?height=300&width=300', 'Cakes', 12, true, true),
('Macarons', 'Delicate French macarons in assorted flavors', 2.50, '/placeholder.svg?height=300&width=300', 'Cookies', 6, false, true);

-- Create an admin user (you'll need to sign up first, then update the role)
-- This is just a placeholder - you'll need to update with actual user ID after signup
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@sweetdreamsbakery.com';
