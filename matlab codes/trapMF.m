function mu = trapMF(x, p)
% Trapezoid / triangle / shoulder membership. p = [a b c d]; works on arrays.
a = p(1); b = p(2); c = p(3); d = p(4);
if b > a, l = (x - a) ./ (b - a); else, l = ones(size(x)); end
if d > c, r = (d - x) ./ (d - c); else, r = ones(size(x)); end
mu = max(min(min(l, 1), r), 0);
end
