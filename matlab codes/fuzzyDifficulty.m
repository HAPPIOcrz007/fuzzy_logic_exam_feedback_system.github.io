function [y, info] = fuzzyDifficulty(c, b, t)
% Mamdani difficulty score (0-100) from complexity c, breadth b, time t.
[IN, OUT] = fuzzySets();
xs = 0:0.5:100;                                   % output universe
c = min(max(c,0),100);  b = min(max(b,0),100);  t = min(max(t,0),100);

mc = zeros(1,3); mb = zeros(1,3); mt = zeros(1,3); outMF = zeros(3,numel(xs));
for m = 1:3                                       % 1. fuzzification
    mc(m) = trapMF(c, IN(m,:));
    mb(m) = trapMF(b, IN(m,:));
    mt(m) = trapMF(t, IN(m,:));
    outMF(m,:) = trapMF(xs, OUT(m,:));
end

w = zeros(1,3);                                   % strength of Easy/Moderate/Difficult
for i = 1:3, for j = 1:3, for k = 1:3             % 2. all 27 rules
    s = (i-1) + (3-j) + (k-1);                    % breadth is reversed
    if s <= 2, o = 1; elseif s == 3, o = 2; else, o = 3; end
    w(o) = max(w(o), min([mc(i), mb(j), mt(k)])); % AND = min, rules joined by max
end, end, end

agg = zeros(size(xs));                            % 3. implication + aggregation
for o = 1:3
    agg = max(agg, min(w(o), outMF(o,:)));
end

if sum(agg) == 0, y = 50;                         % 4. centroid defuzzification
else, y = sum(xs .* agg) / sum(agg); end

info = struct('c',c,'b',b,'t',t,'mc',mc,'mb',mb,'mt',mt,'w',w,'xs',xs,'agg',agg,'y',y);
end
