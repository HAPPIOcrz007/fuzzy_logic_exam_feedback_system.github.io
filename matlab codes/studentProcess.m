function [names, c, b, t, scale] = studentProcess(fname)
% Read students.csv (name, complexity, breadth, time) for any class size.
T     = readtable(fname);
names = string(T{:,1});
raw   = T{:,2:4};
bad   = any(isnan(raw),2) | ismissing(names);
names(bad) = [];  raw(bad,:) = [];                % drop incomplete rows
raw   = max(raw, 0);                              % clip negatives
scale = max(100, max(raw,[],1))';                 % 3x1; column max if above 100
c = raw(:,1)*100/scale(1);
b = raw(:,2)*100/scale(2);
t = raw(:,3)*100/scale(3);
end
