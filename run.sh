minikube start
kubectl apply -f k8s/namespace.yaml
kubectl apply --recursive -f k8s
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.4.2/components.yaml
kubectl patch deployment metrics-server -n kube-system --type 'json' -p '[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--kubelet-insecure-tls"}]'
minikube addons enable ingress

minikube_ip=$(minikube ip)
echo "$minikube_ip movies-frontend" | sudo tee -a /etc/hosts
echo "$minikube_ip movies-api" | sudo tee -a /etc/hosts
