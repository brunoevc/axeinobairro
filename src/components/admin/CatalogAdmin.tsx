
import React, { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ShoppingBag, 
  Tag, 
  CheckCircle2, 
  XCircle,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImageCropUpload } from "../ImageCropUpload";

interface CatalogAdminProps {
  merchantId: string;
  onBack: () => void;
}

export function CatalogAdmin({ merchantId, onBack }: CatalogAdminProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("axei_products") || "[]");
    // Filter by merchantId
    // Initial mock products are not in localStorage, so we should merge them or just manage the custom ones
    // For simplicity in this demo, let's just manage the localStorage ones
    setProducts(saved.filter((p: Product) => p.merchantId === merchantId));
  }, [merchantId]);

  const saveProducts = (newProducts: Product[]) => {
    const allProducts = JSON.parse(localStorage.getItem("axei_products") || "[]");
    const otherMerchantsProducts = allProducts.filter((p: Product) => p.merchantId !== merchantId);
    const updated = [...otherMerchantsProducts, ...newProducts];
    localStorage.setItem("axei_products", JSON.stringify(updated));
    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setCurrentProduct({
      merchantId,
      name: "",
      description: "",
      price: 0,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      category: "Geral",
      isPromotion: false,
      isAvailable: true,
    });
    setIsEditing(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      const updated = products.filter(p => p.id !== productId);
      saveProducts(updated);
      toast.success("Produto excluído com sucesso");
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (!currentProduct.name || !currentProduct.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }

    let updatedProducts: Product[];
    if (currentProduct.id) {
      updatedProducts = products.map(p => p.id === currentProduct.id ? (currentProduct as Product) : p);
      toast.success("Produto atualizado");
    } else {
      const newProduct = {
        ...currentProduct,
        id: `custom-${Date.now()}`,
      } as Product;
      updatedProducts = [...products, newProduct];
      toast.success("Produto adicionado");
    }

    saveProducts(updatedProducts);
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const toggleAvailability = (product: Product) => {
    const updated = products.map(p => 
      p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p
    );
    saveProducts(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            Catálogo de Produtos
          </h2>
        </div>
        <Button 
          onClick={handleAddProduct}
          className="bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl h-12 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Produto
        </Button>
      </div>

      {isEditing && currentProduct && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Nome do Produto</label>
                <Input 
                  value={currentProduct.name}
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  placeholder="Ex: Pizza Margherita"
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Descrição</label>
                <Textarea 
                  value={currentProduct.description}
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  placeholder="Breve descrição dos ingredientes ou detalhes..."
                  className="rounded-xl border-slate-200 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Preço (R$)</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Categoria</label>
                  <Input 
                    value={currentProduct.category}
                    onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                    placeholder="Ex: Lanches, Pizzas..."
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="md:col-span-2">
                <ImageCropUpload
                  label="Imagem do Produto"
                  description="Use uma imagem clara que destaque o produto"
                  recommendedSize="1080x1080 px • 1:1"
                  aspectRatio={1}
                  value={currentProduct.image || ""}
                  onChange={base64 => setCurrentProduct({...currentProduct, image: base64})}
                />
              </div>

              <div className="flex items-center gap-6 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={currentProduct.isPromotion}
                    onChange={e => setCurrentProduct({...currentProduct, isPromotion: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-bold text-slate-700">Em Promoção</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={currentProduct.isAvailable}
                    onChange={e => setCurrentProduct({...currentProduct, isAvailable: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-bold text-slate-700">Disponível</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 h-12 bg-slate-900 text-white font-black rounded-xl hover:bg-black"
                >
                  Salvar Produto
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="h-12 border-slate-200 text-slate-600 font-black rounded-xl"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Seu catálogo está vazio</h3>
          <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
            Adicione seus primeiros produtos para permitir que seus clientes façam pedidos diretamente pelo WhatsApp.
          </p>
          <Button 
            onClick={handleAddProduct}
            variant="outline"
            className="rounded-xl border-slate-200 font-black h-12 px-6"
          >
            Começar Agora
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className={cn(
              "bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex gap-4 transition-all hover:shadow-md",
              !product.isAvailable && "opacity-75"
            )}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{product.category}</span>
                    <h4 className="font-black text-slate-900 truncate">{product.name}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.isPromotion && <Tag className="w-3.5 h-3.5 text-orange-600" />}
                    {product.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                </div>
                <p className="text-lg font-black text-slate-900 mt-1">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEditProduct(product)}
                    className="h-8 px-3 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                  >
                    <Edit3 className="w-3 h-3 mr-1" /> Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => toggleAvailability(product)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-[10px] font-black uppercase",
                      product.isAvailable ? "text-emerald-600 hover:bg-emerald-50" : "text-amber-600 hover:bg-amber-50"
                    )}
                  >
                    {product.isAvailable ? "Pausar" : "Ativar"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="h-8 px-3 rounded-lg text-[10px] font-black uppercase text-slate-300 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
