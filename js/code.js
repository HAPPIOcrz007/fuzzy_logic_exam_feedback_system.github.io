(function(F){
F.code={
norm:{title:'main.m · clamp teacher inputs',desc:'Teacher pilot values are entered directly on the 0-100 scale (sliders cannot exceed 100) and clamped, so teacher and normalised student data share one axis.',
code:`tc = min(max(tc,0),100);
tb = min(max(tb,0),100);
tt = min(max(tt,0),100);
teacherScore = fuzzyDifficulty(tc,tb,tt);`},
sproc:{title:'studentProcess.m',desc:'Reads students.csv (name, complexity, breadth, time), drops incomplete rows, clips negatives to 0, and rescales any column exceeding 100 so its maximum becomes 100. Any class size works.',
code:`T = readtable(fname);
bad = any(isnan(raw),2) | ismissing(names);
raw = max(raw,0);                 % clip negatives
scale = max(100, max(raw,[],1))';  % 3x1
c = raw(:,1)*100/scale(1);
b = raw(:,2)*100/scale(2);
t = raw(:,3)*100/scale(3);`},
fuzzy:{title:'fuzzyDifficulty.m · Mamdani fuzzification',desc:'Each input uses 3 overlapping triangular sets (Low / Medium / High) whose memberships always sum to 1. 27 rules score s = complexity + (reversed breadth) + time (0-6): s<=2 Easy, s=3 Moderate, s>=4 Difficult. AND = min, aggregation = max, centroid of trapezoid outputs gives 0-100. Breadth is inverse: broad coverage = taught = easier.',
code:`P = [0 0 50; 0 50 100; 50 100 100];
O = {[0 0 10 40],[30 45 55 70],[60 90 100 100]};
for i=1:3, for j=1:3, for k=1:3
  s = (i-1) + (3-j) + (k-1);       % breadth reversed
  if s<=2, o=1; elseif s==3, o=2; else, o=3; end
  w(o) = max(w(o), min([mc(i),mb(j),mt(k)]));
end, end, end
agg = max(agg, min(w(o), outMF(o,:)));
y = sum(xs.*agg)/sum(agg);         % centroid`},
plot:{title:'plotResults.m',desc:'Computes mean, median, std, IQR (Q1-Q3), min/max and the gap (students − teacher). Gap > +10 means the paper was HARDER than expected, < −10 EASIER, otherwise as expected. Draws the per-student bar chart and the distribution histogram.',
code:`gap = m - teacher;  tol = 10;
if gap > tol,  verdict = 'HARDER than the teacher expected';
elseif gap < -tol, verdict = 'EASIER than the teacher expected';
else, verdict = 'about AS EXPECTED'; end
bar(1:N, ys);  yline(teacher,'r-');  yline(m,'k--');
histogram(ys, 0:10:100);`}};
})(window.FER=window.FER||{});
